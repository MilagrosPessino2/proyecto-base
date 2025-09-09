import { Paragraph, TextRun, ImageRun } from 'docx';

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
    } as unknown as ConstructorParameters<typeof ImageRun>[0]; // fuerza el overload correcto
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

/** Convierte InlineRun[] a TextRun[] */
function toTextRuns(runs: InlineRun[]): TextRun[] {
    return runs.map(
        (r) =>
            new TextRun({
                text: r.text,
                bold: !!r.bold,
                italics: !!r.italic,
                underline: r.underline ? {} : undefined,
            })
    );
}

/**
 * Convierte HTML enriquecido a Paragraph[].
 * - Soporta p, strong/b, em/i, u, ul/ol/li e img (dataURL o por fetch).
 * - Para listas usa “• ” y “1. ” como prefijo (simple).
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
            if (txt) blocks.push(new Paragraph(txt));
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
                    blocks.push(new Paragraph({ children: [image] }));
                } catch {
                    blocks.push(
                        new Paragraph(`[Imagen no disponible: ${src}]`)
                    );
                }
            } else {
                let runs: InlineRun[] = [];
                el.childNodes.forEach(
                    (cn) => (runs = runs.concat(inlineHtmlToRuns(cn)))
                );
                if (runs.length > 0)
                    blocks.push(new Paragraph({ children: toTextRuns(runs) }));
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
                const bullet = new TextRun('• ');
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
                const num = new TextRun(`${olCounter++}. `);
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
                blocks.push(new Paragraph({ children: [image] }));
            } catch {
                blocks.push(new Paragraph(`[Imagen no disponible: ${src}]`));
            }
            continue;
        }

        const fallback = normalizeText(el.textContent ?? '');
        if (fallback) blocks.push(new Paragraph(fallback));
    }

    return blocks;
}
