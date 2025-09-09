import type { SeccionAreaRich, BuildDocRichInput } from './types';
import { htmlToDocxBlocks } from './richHtmlToDocx';
import { buildHeader, buildFooter, buildSectorBox } from './blocks';
import { COLOR_TOKENS } from './colors';
import {
    DOCX_FONT,
    DOCX_FONT_SIZES,
    DOCX_SPACING,
    DOCX_IMAGES,
    DOCX_BORDERS,
    DOCX_CONFIDENTIAL_LABEL,
} from '../config/constants';
import {
    Document,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    Table,
} from 'docx';

const FONT = DOCX_FONT;
const SIZE_AREA = DOCX_FONT_SIZES.area; // 12pt

/**
 * Construye el Document a partir de secciones con rich HTML.
 * Inserta header/footer, caja de sector y separadores entre items.
 */
export async function buildDocDesdeRich(
    secciones: SeccionAreaRich[],
    sectorGeneral: string,
    confidentialityLabel: string = DOCX_CONFIDENTIAL_LABEL
): Promise<Document> {
    // Mezclamos Table (sectorBox) y Paragraphs en una sola lista
    const sectionChildren: Array<Paragraph | Table> = [];

    // 1) Caja con el sector general
    const sectorBox = buildSectorBox(sectorGeneral) as unknown as Table;
    sectionChildren.push(sectorBox);
    // Aire debajo del box
    sectionChildren.push(
        new Paragraph({ spacing: { after: DOCX_SPACING.afterSectorBox } })
    );

    // 2) Áreas + Items
    for (const sec of secciones) {
        // Título de área — Calibri 12, negro, negrita, con aire debajo
        sectionChildren.push(
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: DOCX_SPACING.afterAreaTitle },
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
                maxImageWidth: DOCX_IMAGES.maxWidth,
                maxImageHeight: DOCX_IMAGES.maxHeight,
            });
            sectionChildren.push(...bloques);

            // Separador fino debajo de cada novedad + aire arriba/abajo
            sectionChildren.push(
                new Paragraph({
                    border: {
                        bottom: {
                            style: BorderStyle.SINGLE,
                            size: DOCX_BORDERS.separatorLineSize,
                            color: COLOR_TOKENS.separadorLinea,
                        },
                    },
                    spacing: {
                        before: DOCX_SPACING.separatorBeforeAfter,
                        after: DOCX_SPACING.separatorBeforeAfter,
                    },
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
    const {
        sectorGeneral,
        novedad,
        confidentialityLabel = DOCX_CONFIDENTIAL_LABEL,
    } = input;

    return buildDocDesdeRich(novedad, sectorGeneral, confidentialityLabel);
}
