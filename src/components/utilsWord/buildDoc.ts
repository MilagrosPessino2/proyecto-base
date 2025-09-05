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
} from './blocks';
import type { areaSection, BuildDocInput } from './types';

/** Carga una imagen (URL) como Uint8Array */
async function loadImage(url: string): Promise<Uint8Array> {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
}

/** Construye las secciones (async porque carga imágenes) */
async function buildSectionsAsync(
    sections: areaSection[],
    maxItems: number
): Promise<(Paragraph | Table)[]> {
    const out: (Paragraph | Table)[] = [];

    for (const { gerencia, items } of sections) {
        const limited = items.slice(0, maxItems);

        // Título del área
        out.push(areaHeading(gerencia));

        // Items de la novedad
        for (const { titulo: t, resumen, imagenes } of limited) {
            out.push(noveltyTitle(t));
            out.push(noveltyDetail(resumen));

            // Si hay imágenes, las cargamos y armamos la galería
            if (imagenes && imagenes.length > 0) {
                const datas: Uint8Array[] = [];
                for (const url of imagenes) {
                    try {
                        datas.push(await loadImage(url));
                    } catch {
                        // Si una imagen falla, seguimos con las demás (silencioso)
                    }
                }
                if (datas.length > 0) {
                    out.push(imageGallery(datas, { perRow: 2 })); // 2 imágenes por fila
                }
            }

            // Separador al final de cada novedad
            out.push(thinSeparator());
        }

        // Espacio al final de cada gerencia
        out.push(new Paragraph({ spacing: { after: 200 } }));
    }

    return out;
}

// ---- builder principal ----
// 👇 AHORA ES ASYNC
export async function createNovedadesDoc(
    input: BuildDocInput
): Promise<Document> {
    const {
        areaTitle,
        novedad,
        maxItemsPerSection = 3,
        confidentialityLabel = 'YPF-Confidencial',
    } = input;

    const sectionChildren = [
        makeareaBox(areaTitle),
        ...(await buildSectionsAsync(novedad, maxItemsPerSection)),
    ];

    return new Document({
        styles: {
            default: {
                document: {
                    run: { font: 'Calibri' }, // fuente global del .docx
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
