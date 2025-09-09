import { Paragraph, TextRun, ImageRun, AlignmentType } from 'docx';

const FONT = 'Calibri';
const SIZE_BODY = 20; // 10pt
const SIZE_H1 = 22; // 11pt (h1 interno del item)
const COLOR_H1 = '2F75B5'; // azul estilo Office

function dataUrlToUint8(dataUrl: string): Uint8Array {
    const [, base64] = dataUrl.split(',');
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

async function fetchImageAsBlob(
    url: string
): Promise<{ blob: Blob; bytes: Uint8Array }> {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se pudo descargar imagen: ' + url);
    const blob = await res.blob();
    const buf = await blob.arrayBuffer();
    return { blob, bytes: new Uint8Array(buf) };
}

function getNaturalSizeFromBlobOrSrc(
    srcOrBlob: string | Blob
): Promise<{ w: number; h: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const done = () => {
            img.onload = null;
            img.onerror = null;
        };
        if (typeof srcOrBlob === 'string') {
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                done();
                resolve({ w: img.naturalWidth, h: img.naturalHeight });
            };
            img.onerror = (e) => {
                done();
                reject(e);
            };
            img.src = srcOrBlob;
        } else {
            const url = URL.createObjectURL(srcOrBlob);
            img.onload = () => {
                done();
                URL.revokeObjectURL(url);
                resolve({ w: img.naturalWidth, h: img.naturalHeight });
            };
            img.onerror = (e) => {
                done();
                URL.revokeObjectURL(url);
                reject(e);
            };
            img.src = url;
        }
    });
}

function scaleKeepAspect(nw: number, nh: number, maxW?: number, maxH?: number) {
    if (!nw || !nh) return { w: maxW || 300, h: maxH || 200 };
    if (!maxW && !maxH) return { w: nw, h: nh };
    const limW = maxW ?? nw;
    const limH = maxH ?? nh;
    const s = Math.min(limW / nw, limH / nh, 1);
    return { w: Math.round(nw * s), h: Math.round(nh * s) };
}

function normalizeText(s: string) {
    return s.replace(/\s+/g, ' ').trim();
}

interface InlineRun {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

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
        return runs;
    }
    return [];
}

function toBodyRuns(runs: InlineRun[]): TextRun[] {
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

async function paragraphFromImgSrc(
    src: string,
    maxW?: number,
    maxH?: number
): Promise<Paragraph> {
    try {
        let bytes: Uint8Array,
            natW = 0,
            natH = 0;
        if (src.startsWith('data:image/')) {
            bytes = dataUrlToUint8(src);
            ({ w: natW, h: natH } = await getNaturalSizeFromBlobOrSrc(src));
        } else {
            const { blob, bytes: bx } = await fetchImageAsBlob(src);
            bytes = bx;
            ({ w: natW, h: natH } = await getNaturalSizeFromBlobOrSrc(blob));
        }
        const { w, h } = scaleKeepAspect(natW, natH, maxW, maxH);

        // Nota: Word a veces ignora spacing en párrafos con solo imagen;
        // el separador EXTRA lo agregamos en htmlToDocxBlocks.
        return new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 0 }, // after=0: el espaciado real lo pone el separador extra
            children: [rasterImageRun(bytes, w, h)],
        });
    } catch {
        return new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 0 },
            children: [
                new TextRun({
                    text: `[Imagen no disponible: ${src}]`,
                    font: FONT,
                    size: SIZE_BODY,
                }),
            ],
        });
    }
}

/** HTML → Paragraph[] (h1 azul, cuerpo Calibri 10, imágenes centradas con separadores de 2pt) */
export async function htmlToDocxBlocks(
    html: string,
    opts?: { maxImageWidth?: number; maxImageHeight?: number }
): Promise<Paragraph[]> {
    const { maxImageWidth, maxImageHeight } = opts || {};
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

        if (tag === 'h1') {
            let runs: InlineRun[] = [];
            el.childNodes.forEach((cn) => {
                runs = runs.concat(inlineHtmlToRuns(cn));
            });
            const titleRuns = runs.map(
                (r) =>
                    new TextRun({
                        text: r.text,
                        bold: true,
                        italics: !!r.italic,
                        underline: r.underline ? {} : undefined,
                        font: FONT,
                        size: SIZE_H1,
                        color: COLOR_H1,
                    })
            );
            blocks.push(new Paragraph({ children: titleRuns }));
            continue;
        }

        if (tag === 'p') {
            const imgs = Array.from(el.querySelectorAll('img'));
            if (
                imgs.length === 1 &&
                normalizeText(el.textContent ?? '') === ''
            ) {
                const src =
                    (imgs[0] as HTMLImageElement).getAttribute('src') || '';
                const imgPara = await paragraphFromImgSrc(
                    src,
                    maxImageWidth,
                    maxImageHeight
                );
                blocks.push(imgPara);
                // --- separador de 2pt tras cada imagen ---
                blocks.push(new Paragraph({ spacing: { after: 40 } }));
            } else {
                let runs: InlineRun[] = [];
                el.childNodes.forEach((cn) => {
                    runs = runs.concat(inlineHtmlToRuns(cn));
                });
                if (runs.length > 0)
                    blocks.push(new Paragraph({ children: toBodyRuns(runs) }));
            }
            continue;
        }

        if (tag === 'ul') {
            const lis = Array.from(el.querySelectorAll(':scope > li'));
            lis.forEach((li) => {
                let runs: InlineRun[] = [];
                li.childNodes.forEach((cn) => {
                    runs = runs.concat(inlineHtmlToRuns(cn));
                });
                const bullet = new TextRun({
                    text: '• ',
                    font: FONT,
                    size: SIZE_BODY,
                    color: '000000',
                });
                blocks.push(
                    new Paragraph({ children: [bullet, ...toBodyRuns(runs)] })
                );
            });
            continue;
        }

        if (tag === 'ol') {
            const lis = Array.from(el.querySelectorAll(':scope > li'));
            lis.forEach((li) => {
                let runs: InlineRun[] = [];
                li.childNodes.forEach((cn) => {
                    runs = runs.concat(inlineHtmlToRuns(cn));
                });
                const num = new TextRun({
                    text: `${olCounter++}. `,
                    font: FONT,
                    size: SIZE_BODY,
                    color: '000000',
                });
                blocks.push(
                    new Paragraph({ children: [num, ...toBodyRuns(runs)] })
                );
            });
            olCounter = 1;
            continue;
        }

        if (tag === 'img') {
            const src = (el as HTMLImageElement).getAttribute('src') || '';
            const imgPara = await paragraphFromImgSrc(
                src,
                maxImageWidth,
                maxImageHeight
            );
            blocks.push(imgPara);
            // --- separador de 2pt tras imagen suelta ---
            blocks.push(new Paragraph({ spacing: { after: 40 } }));
            continue;
        }

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
