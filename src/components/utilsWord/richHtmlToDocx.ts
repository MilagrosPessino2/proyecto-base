/**
 * Transforma un fragmento de HTML controlado (p, h1, b/i/u, ul/ol, img)
 * en bloques Docx (Paragraph/ImageRun), aplicando la tipografía corporativa
 * y separadores entre imágenes para que no queden pegadas.
 */

import { Paragraph, TextRun, ImageRun, AlignmentType } from 'docx';
import { COLOR_TOKENS } from './colors';

// ---- Estilos base del documento ----
const FONT = 'Calibri';
const SIZE_BODY = 20; // 10pt para texto general
const SIZE_H1 = 22; // 11pt para <h1> dentro del rich HTML

// -------------------------------------------------------------
// Utilidades para trabajar con imágenes (dataURL / URL remota)
// -------------------------------------------------------------

/** Convierte un dataURL (base64) a bytes (Uint8Array). */
function dataUrlToUint8(dataUrl: string): Uint8Array {
    const [, base64] = dataUrl.split(',');
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

/**
 * Descarga una imagen por URL y la devuelve como:
 * - blob: para poder medir dimensiones naturales con <img>
 * - bytes: para pasárselo a ImageRun
 */
async function fetchImageAsBlob(
    url: string
): Promise<{ blob: Blob; bytes: Uint8Array }> {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se pudo descargar imagen: ' + url);
    const blob = await res.blob();
    const buf = await blob.arrayBuffer();
    return { blob, bytes: new Uint8Array(buf) };
}

/**
 * Obtiene tamaño natural (px) de una imagen a partir de:
 *  - un dataURL/URL (string), o
 *  - un Blob (por ej. descargado).
 * Usamos un <img> en memoria para leer naturalWidth/Height.
 */
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

/**
 * Calcula un tamaño escalado manteniendo proporción (si hay límites).
 * Si no hay límites, devuelve el tamaño natural.
 */
function scaleKeepAspect(nw: number, nh: number, maxW?: number, maxH?: number) {
    if (!nw || !nh) return { w: maxW || 300, h: maxH || 200 };
    if (!maxW && !maxH) return { w: nw, h: nh };
    const limW = maxW ?? nw;
    const limH = maxH ?? nh;
    const s = Math.min(limW / nw, limH / nh, 1);
    return { w: Math.round(nw * s), h: Math.round(nh * s) };
}

// ---------------------------
// Utilidades para texto inline
// ---------------------------

/** Normaliza espacios/enters repetidos en TEXT_NODES. */
function normalizeText(s: string) {
    return s.replace(/\s+/g, ' ').trim();
}

/** Modelo intermedio para acumular estilos inline antes de crear TextRun. */
interface InlineRun {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

/**
 * Crea un ImageRun “raster” forzando el overload correcto de docx.
 * (Evitamos el overload de SVG que rompe los tipos con TS.)
 */
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
 * Recorre el DOM inline y devuelve runs intermedios con flags de estilo.
 * Soporta: <b>/<strong>, <i>/<em>, <u>.
 * Otras etiquetas inline se “aplanan” como texto.
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
        return runs;
    }
    return [];
}

/** Convierte los InlineRun a TextRun con tipografía corporativa. */
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
                color: COLOR_TOKENS.textoDetalleNovedad,
            })
    );
}

// --------------------------------------
// Construcción de párrafos con imágenes
// --------------------------------------

/**
 * Crea un Paragraph centrado con una imagen.
 * Nota: Word a veces ignora `spacing.after` en párrafos con SOLO una imagen.
 * Por eso, además de este párrafo, el caller agrega un “separador”
 * (Paragraph vacío con spacing) inmediatamente después.
 */
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
            // Imagen embebida (dataURL)
            bytes = dataUrlToUint8(src);
            ({ w: natW, h: natH } = await getNaturalSizeFromBlobOrSrc(src));
        } else {
            // Imagen por URL: la bajamos a Blob y medimos tamaño natural
            const { blob, bytes: bx } = await fetchImageAsBlob(src);
            bytes = bx;
            ({ w: natW, h: natH } = await getNaturalSizeFromBlobOrSrc(blob));
        }

        // Escalamos manteniendo proporción, respetando limites si existen
        const { w, h } = scaleKeepAspect(natW, natH, maxW, maxH);

        return new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 0 }, // el espaciado real post-imagen lo agrega el “separador” externo
            children: [rasterImageRun(bytes, w, h)],
        });
    } catch {
        // Fallback cuando no se pudo cargar la imagen
        return new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 0 },
            children: [
                new TextRun({
                    text: `[Imagen no disponible: ${src}]`,
                    font: FONT,
                    size: SIZE_BODY,
                    color: COLOR_TOKENS.textoDetalleNovedad,
                }),
            ],
        });
    }
}

// -------------------------------------------------------
// HTML → Paragraph[] (cuerpo Calibri 10, h1 tokenizado, etc.)
// -------------------------------------------------------

/**
 * Parsea HTML controlado y devuelve un arreglo de Paragraph listo para Docx.
 * Soportado:
 *  - h1: título de la novedad (azul corporativo, negrita).
 *  - p: párrafos de texto o una única imagen.
 *  - ul/ol/li: listas simples (prefijos “• ” y “1. ”).
 *  - img: dataURL o URL absoluta/relativa; centradas y con separador de 2pt luego.
 */
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

    // Recorremos nodos de primer nivel del body
    for (const node of Array.from(body.childNodes)) {
        // Texto plano suelto → Paragraph simple
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
                                color: COLOR_TOKENS.textoDetalleNovedad,
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

        // ---------- <h1> (título de la novedad) ----------
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
                        color: COLOR_TOKENS.tituloItemNovedad, // azul corporativo tokenizado
                    })
            );

            blocks.push(new Paragraph({ children: titleRuns }));
            continue;
        }

        // ---------- <p> (párrafo de texto o imagen en bloque) ----------
        if (tag === 'p') {
            const imgs = Array.from(el.querySelectorAll('img'));

            // Caso: párrafo que contiene solo una imagen
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

                // Separador extra (≈2pt) para que imágenes sucesivas no queden pegadas
                blocks.push(new Paragraph({ spacing: { after: 40 } }));
            } else {
                // Caso: texto (posiblemente con inline <b>/<i>/<u>)
                let runs: InlineRun[] = [];
                el.childNodes.forEach((cn) => {
                    runs = runs.concat(inlineHtmlToRuns(cn));
                });
                if (runs.length > 0)
                    blocks.push(new Paragraph({ children: toBodyRuns(runs) }));
            }
            continue;
        }

        // ---------- <ul> (lista con bullets) ----------
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
                    color: COLOR_TOKENS.textoDetalleNovedad,
                });
                blocks.push(
                    new Paragraph({ children: [bullet, ...toBodyRuns(runs)] })
                );
            });
            continue;
        }

        // ---------- <ol> (lista numerada simple) ----------
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
                    color: COLOR_TOKENS.textoDetalleNovedad,
                });
                blocks.push(
                    new Paragraph({ children: [num, ...toBodyRuns(runs)] })
                );
            });
            olCounter = 1; // resetea para la próxima <ol> hermana
            continue;
        }

        // ---------- <img> suelta (fuera de <p>) ----------
        if (tag === 'img') {
            const src = (el as HTMLImageElement).getAttribute('src') || '';
            const imgPara = await paragraphFromImgSrc(
                src,
                maxImageWidth,
                maxImageHeight
            );
            blocks.push(imgPara);
            // Separador extra (≈2pt) para imagen suelta
            blocks.push(new Paragraph({ spacing: { after: 40 } }));
            continue;
        }

        // ---------- Cualquier otro bloque: dump de texto normalizado ----------
        const fallback = normalizeText(el.textContent ?? '');
        if (fallback) {
            blocks.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: fallback,
                            font: FONT,
                            size: SIZE_BODY,
                            color: COLOR_TOKENS.textoDetalleNovedad,
                        }),
                    ],
                })
            );
        }
    }

    return blocks;
}
