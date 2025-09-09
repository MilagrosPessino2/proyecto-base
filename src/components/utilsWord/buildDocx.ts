import type { SeccionAreaRich, BuildDocRichInput } from './types';
import { htmlToDocxBlocks } from './richHtmlToDocx';
import { buildHeader, buildFooter, buildSectorBox } from './blocks';
import { COLOR_TOKENS } from './colors';
import {
    Document,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    Table,
} from 'docx';

const FONT = 'Calibri';
const SIZE_AREA = 24; // 12pt

export async function buildDocDesdeRich(
    secciones: SeccionAreaRich[],
    sectorGeneral: string,
    confidentialityLabel: string
): Promise<Document> {
    // Vamos a mezclar una Table (sectorBox) y múltiples Paragraphs
    const sectionChildren: Array<Paragraph | Table> = [];

    // Caja con el sector general (Table)
    const sectorBox = buildSectorBox(sectorGeneral) as unknown as Table;

    // Box primero...
    sectionChildren.push(sectorBox);
    // ...y un pequeño espacio debajo del box (≈6pt)
    sectionChildren.push(new Paragraph({ spacing: { after: 120 } }));

    // Recorremos las áreas
    for (const sec of secciones) {
        // Título de área — Calibri 12, negro, negrita, con algo de aire debajo
        sectionChildren.push(
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 200 }, // ≈10pt
                children: [
                    new TextRun({
                        text: sec.areaNovedad,
                        font: FONT,
                        size: SIZE_AREA,
                        color: COLOR_TOKENS.textoDetalleNovedad,
                        bold: true,
                    }),
                ],
            })
        );

        // Items (cada uno con su richHtml)
        for (const item of sec.items) {
            const bloques = await htmlToDocxBlocks(item.richHtml, {
                maxImageWidth: 420,
                maxImageHeight: 280,
            });
            sectionChildren.push(...bloques);

            // Separador fino debajo de cada novedad + aire arriba/abajo
            sectionChildren.push(
                new Paragraph({
                    border: {
                        bottom: {
                            style: BorderStyle.SINGLE,
                            size: 6,
                            color: COLOR_TOKENS.separadorLinea,
                        },
                    },
                    spacing: { before: 200, after: 200 }, // ≈10pt arriba y abajo
                })
            );
        }
    }

    return new Document({
        sections: [
            {
                headers: { default: buildHeader(confidentialityLabel) },
                footers: { default: buildFooter(confidentialityLabel) },
                children: sectionChildren,
            },
        ],
    });
}

/** Export para el hook */
export async function createNovedadesDoc(
    input: BuildDocRichInput
): Promise<Document> {
    const { sectorGeneral, novedad, confidentialityLabel } = input;
    return buildDocDesdeRich(novedad, sectorGeneral, confidentialityLabel);
}
