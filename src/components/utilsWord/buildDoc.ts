import { Document, Paragraph, Table } from 'docx';
import {
    buildFooter,
    buildHeader,
    makeareaBox,
    areaHeading,
    noveltyDetail,
    noveltyTitle,
    thinSeparator,
    imageGallery,
} from './blocks'; // ← viene del barrel de la CARPETA
import type { SeccionArea, BuildDocInput } from './types';

/** Carga una imagen, valida que sea imagen, obtiene tamaño real
 *  y devuelve bytes + tamaño escalado manteniendo proporción dentro de (maxW x maxH). */
async function loadImageWithSize(
    url: string,
    maxW = 250,
    maxH = 160
): Promise<{ data: Uint8Array; width: number; height: number } | null> {
    const res = await fetch(url);
    if (!res.ok) return null;

    const blob = await res.blob();

    if (!blob.type || !blob.type.startsWith('image/')) return null;

    const objectUrl = URL.createObjectURL(blob);
    const dims = await new Promise<{ w: number; h: number }>(
        (resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const w = img.naturalWidth || 0;
                const h = img.naturalHeight || 0;
                URL.revokeObjectURL(objectUrl);
                resolve({ w, h });
            };
            img.onerror = (e) => {
                URL.revokeObjectURL(objectUrl);
                reject(e);
            };
            img.src = objectUrl;
        }
    ).catch(() => ({ w: 0, h: 0 }));

    if (!dims.w || !dims.h) return null;

    const scale = Math.min(maxW / dims.w, maxH / dims.h, 1);
    const width = Math.max(1, Math.round(dims.w * scale));
    const height = Math.max(1, Math.round(dims.h * scale));

    const buf = await blob.arrayBuffer();
    const data = new Uint8Array(buf);
    if (data.byteLength === 0) return null;

    return { data, width, height };
}

/** Construye TODAS las secciones (sin límite de items) */
async function buildSectionsAsync(
    sections: SeccionArea[]
): Promise<(Paragraph | Table)[]> {
    const out: (Paragraph | Table)[] = [];

    for (const { areaNovedad, items } of sections) {
        // Encabezado del área
        out.push(areaHeading(areaNovedad));

        for (const {
            tituloNovedad,
            detalleNovedad,
            imagenesNovedad,
        } of items) {
            out.push(noveltyTitle(tituloNovedad));
            out.push(noveltyDetail(detalleNovedad));

            // Galería de imágenes (si hay): ahora SIEMPRE 1 columna y centradas (lo maneja imageGallery)
            if (imagenesNovedad && imagenesNovedad.length > 0) {
                const images: {
                    data: Uint8Array;
                    width: number;
                    height: number;
                }[] = [];
                for (const url of imagenesNovedad) {
                    try {
                        const img = await loadImageWithSize(url, 250, 160);
                        if (img) images.push(img);
                    } catch {
                        /* omit */
                    }
                }
                if (images.length > 0) out.push(imageGallery(images));
            }

            // Separador al final de cada item
            out.push(thinSeparator());
        }

        // Espacio al final de cada área
        out.push(new Paragraph({ spacing: { after: 200 } }));
    }

    return out;
}

/** Builder principal (async) */
export async function createNovedadesDoc(
    input: BuildDocInput
): Promise<Document> {
    const {
        sectorGeneral,
        novedad,
        confidentialityLabel = 'YPF-Confidencial',
    } = input;

    const sectionChildren = [
        makeareaBox(sectorGeneral),
        ...(await buildSectionsAsync(novedad)),
    ];

    return new Document({
        styles: {
            default: {
                document: {
                    run: { font: 'Calibri' },
                    paragraph: { spacing: { line: 276 } }, // ~1.15
                },
            },
        },
        sections: [
            {
                headers: { default: buildHeader(confidentialityLabel) },
                footers: { default: buildFooter(confidentialityLabel) },
                children: sectionChildren,
            },
        ],
    });
}

export default createNovedadesDoc;
