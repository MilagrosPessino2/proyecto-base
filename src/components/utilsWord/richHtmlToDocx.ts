import { Paragraph, TextRun, ImageRun, AlignmentType } from 'docx';

/** === Estilos base === */
const FONT = 'Calibri';
const SIZE_BODY = 20; // 10pt
const SIZE_H1 = 22; // 11pt (por si lo necesitás acá)
const SIZE_AREA = 24; // 12pt

/** Convierte dataURL base64 → Uint8Array */
function dataUrlToUint8(dataUrl: string): Uint8Array {
    const [, base64] = dataUrl.split(',');
    const bin = atob(base64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

/** Descarga imagen por URL (relativa o absoluta) y retorna bytes. */
async function fetchImageBytes(url: string): Promise<Uint8Array> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`No se pudo descargar imagen: ${url}`);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
}

/** Normaliza espacios/enters repetidos de texto plano dentro de etiquetas */
function normalizeText(s: string): string {
    return s.replace(/\s+/g, ' ').trim();
}

/** Modelo intermedio para estilos inline */
interface InlineRun {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

/** Crea un ImageRun forzando el branch raster (evita overload SVG en los tipos de docx) */
function rasterImageRun(
    bytes: Uint8Array,
    width: number,
    height: number
): ImageRun {
    const opts = {
        data: bytes,
        transformation: { width, height },
    } as unknown as ConstructorParameters<typeof ImageRun>[0];
    return new ImageRun(opts);
}

/**
 * Parsea un nodo inline y devuelve runs intermedios (no TextRun todavía).
 * Soporta <strong>/<b>, <em>/<i>, <u>.
 */
function inlineHtmlToRuns(node: ChildNode): InlineRun[] {
    if (node.nodeType === Node.TEXT_NODE) {
        const txt = normalizeText(node.textContent ?? '');
        return txt ? [{ text: txt }] : [];
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        let runs: InlineRun[] = [];
        el.childNodes.forEach((cn) => {
            runs = runs.concat(inlineHtmlToRuns(cn));
        });

        if (tag === 'strong' || tag === 'b')
            return runs.map((r) => ({ ...r, bold: true }));
        if (tag === 'em' || tag === 'i')
            return runs.map((r) => ({ ...r, italic: true }));
        if (tag === 'u') return runs.map((r) => ({ ...r, underline: true }));

        return runs; // otras inline sin cambios
    }

    return [];
}

/** Convierte InlineRun[] a TextRun[] con Calibri 10 por defecto */
function toTextRuns(runs: InlineRun[]): TextRun[] {
    return runs.map(
        (r) =>
            new TextRun({
                text: r.text,
                bold: !!r.bold,
                italics: !!r.italic,
                underline: r.underline ? {} : undefined,
                font: FONT,
                size: SIZE_BODY,
                color: '000000',
            })
    );
}

/**
 * Convierte HTML enriquecido a Paragraph[] con estilos de cuerpo
 * - Soporta p, strong/b, em/i, u, ul/ol/li e img (dataURL o por fetch)
 * - Listas simples con “• ” y “1. ”
 * - Imágenes centradas
 */
export async function htmlToDocxBlocks(
    html: string,
    opts?: { maxImageWidth?: number; maxImageHeight?: number }
): Promise<Paragraph[]> {
    const { maxImageWidth = 450, maxImageHeight = 300 } = opts || {};

    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, 'text/html');
    const body = parsed.body;

    const blocks: Paragraph[] = [];
    let olCounter = 1;

    for (const node of Array.from(body.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE) {
            const txt = normalizeText(node.textContent ?? '');
            if (txt) {
                blocks.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: txt,
                                font: FONT,
                                size: SIZE_BODY,
                                color: '000000',
                            }),
                        ],
                    })
                );
            }
            continue;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        // <p>
        if (tag === 'p') {
            const imgs = Array.from(el.querySelectorAll('img'));
            if (
                imgs.length === 1 &&
                normalizeText(el.textContent ?? '') === ''
            ) {
                const imgEl = imgs[0] as HTMLImageElement;
                const src = imgEl.getAttribute('src') || '';
                try {
                    let bytes: Uint8Array;
                    if (src.startsWith('data:image/'))
                        bytes = dataUrlToUint8(src);
                    else bytes = await fetchImageBytes(src);

                    const image = rasterImageRun(
                        bytes,
                        maxImageWidth,
                        maxImageHeight
                    );
                    blocks.push(
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [image],
                        })
                    );
                } catch {
                    blocks.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `[Imagen no disponible: ${src}]`,
                                    font: FONT,
                                    size: SIZE_BODY,
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })
                    );
                }
            } else {
                let runs: InlineRun[] = [];
                el.childNodes.forEach(
                    (cn) => (runs = runs.concat(inlineHtmlToRuns(cn)))
                );
                if (runs.length > 0) {
                    blocks.push(new Paragraph({ children: toTextRuns(runs) }));
                }
            }
            continue;
        }

        // <ul>
        if (tag === 'ul') {
            const lis = Array.from(el.querySelectorAll(':scope > li'));
            lis.forEach((li) => {
                let runs: InlineRun[] = [];
                li.childNodes.forEach(
                    (cn) => (runs = runs.concat(inlineHtmlToRuns(cn)))
                );
                const bullet = new TextRun({
                    text: '• ',
                    font: FONT,
                    size: SIZE_BODY,
                    color: '000000',
                });
                blocks.push(
                    new Paragraph({ children: [bullet, ...toTextRuns(runs)] })
                );
            });
            continue;
        }

        // <ol>
        if (tag === 'ol') {
            const lis = Array.from(el.querySelectorAll(':scope > li'));
            lis.forEach((li) => {
                let runs: InlineRun[] = [];
                li.childNodes.forEach(
                    (cn) => (runs = runs.concat(inlineHtmlToRuns(cn)))
                );
                const num = new TextRun({
                    text: `${olCounter++}. `,
                    font: FONT,
                    size: SIZE_BODY,
                    color: '000000',
                });
                blocks.push(
                    new Paragraph({ children: [num, ...toTextRuns(runs)] })
                );
            });
            olCounter = 1;
            continue;
        }

        // <img> suelta
        if (tag === 'img') {
            const src = (el as HTMLImageElement).getAttribute('src') || '';
            try {
                let bytes: Uint8Array;
                if (src.startsWith('data:image/')) bytes = dataUrlToUint8(src);
                else bytes = await fetchImageBytes(src);

                const image = rasterImageRun(
                    bytes,
                    maxImageWidth,
                    maxImageHeight
                );
                blocks.push(
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [image],
                    })
                );
            } catch {
                blocks.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `[Imagen no disponible: ${src}]`,
                                font: FONT,
                                size: SIZE_BODY,
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                    })
                );
            }
            continue;
        }

        // Cualquier otra etiqueta → texto plano con estilo cuerpo
        const fallback = normalizeText(el.textContent ?? '');
        if (fallback) {
            blocks.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: fallback,
                            font: FONT,
                            size: SIZE_BODY,
                            color: '000000',
                        }),
                    ],
                })
            );
        }
    }

    return blocks;
}
