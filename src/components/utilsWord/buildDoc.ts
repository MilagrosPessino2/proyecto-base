import { Document, Paragraph } from 'docx';
import {
    buildFooter,
    buildHeader,
    makeareaBox,
    areaHeading,
    noveltyDetail,
    noveltyTitle,
    thinSeparator,
} from './blocks';
import { imageGallery } from './blocks/imageGallery';
import type { SeccionArea, BuildDocInput } from './types';

import {
    loadImageOriginal,
    insertarOrdenado,
    comparaImagenesPorAltoAncho,
} from './images';

type ImgEscalada = { data: Uint8Array; width: number; height: number };

async function buildSectionsAsync(
    sections: SeccionArea[],
    pageContentWidthPx: number,
    minImageWidthPx = 0
): Promise<Paragraph[]> {
    const out: Paragraph[] = [];

    for (const { areaNovedad, items } of sections) {
        out.push(areaHeading(areaNovedad));

        for (const { tituloNovedad, detalleNovedad, imagenesNovedad } of items) {
            out.push(noveltyTitle(tituloNovedad));
            out.push(noveltyDetail(detalleNovedad));

            if (imagenesNovedad && imagenesNovedad.length > 0) {
                //ordenado usando comparador (alto ASC → ancho ASC)
                const wrappersOrdenados: {
                    data: Uint8Array;
                    dimension: { alto: number; ancho: number };
                    original: { alto: number; ancho: number };
                }[] = [];

                for (const url of imagenesNovedad) {
                    try {
                        const raw = await loadImageOriginal(url);
                        if (!raw) continue;

                        const relacion = raw.ancho > 0 ? raw.alto / raw.ancho : 0;
                        if (!(relacion > 0 && isFinite(relacion))) continue;

                        // ancho natural limitado al ancho de contenido
                        const naturalMax = Math.min(
                            Math.max(1, raw.ancho),
                            Math.max(1, pageContentWidthPx)
                        );

                        let width: number;
                        if (minImageWidthPx > 0) {
                            width = Math.min(naturalMax, Math.max(1, minImageWidthPx));
                        } else {
                            width = naturalMax;
                        }

                        const height = Math.max(1, Math.round(width * relacion));

                        //estructura ImagenOrdenada-compatible para ordenar
                        const wrapper = {
                            data: raw.data,
                            dimension: { alto: height, ancho: width },
                            original: { alto: raw.alto, ancho: raw.ancho },
                        };

                        insertarOrdenado(
                            wrappersOrdenados,
                            wrapper,
                            comparaImagenesPorAltoAncho 
                        );
                    } catch {
                        // ignorar imagen fallida
                    }
                }

                if (wrappersOrdenados.length > 0) {
                    const escaladas: ImgEscalada[] = wrappersOrdenados.map(w => ({
                        data: w.data,
                        width: w.dimension.ancho,
                        height: w.dimension.alto,
                    }));
                    out.push(...imageGallery(escaladas));
                }
            }

            out.push(thinSeparator());
        }

        out.push(new Paragraph({ spacing: { after: 50 } }));
    }

    return out;
}

/* Builder principal (async) */
export async function createNovedadesDoc(
    input: BuildDocInput
): Promise<Document> {
    const {
        sectorGeneral,
        novedad,
        confidentialityLabel = 'YPF-Confidencial',
    } = input;

    const PAGE_CONTENT_WIDTH = 500;
    const MIN_IMAGE_WIDTH = 0; 

    const sectionChildren = [
        makeareaBox(sectorGeneral),
        ...(await buildSectionsAsync(novedad, PAGE_CONTENT_WIDTH, MIN_IMAGE_WIDTH)),
    ];

    return new Document({
        styles: {
            default: {
                document: {
                    run: { font: 'Calibri' },
                    paragraph: { spacing: { before: 80, after: 80 } },
                },
            },
        },
        sections: [
            {
                headers: { default: buildHeader(confidentialityLabel) },
                footers: { default: buildFooter(confidentialityLabel) },
                children: sectionChildren
            },
        ],
    });
}

export default createNovedadesDoc;
