import { Document, Paragraph, TextRun, HeadingLevel } from 'docx';
import type { SeccionAreaRich, BuildDocRichInput } from './types';
import { htmlToDocxBlocks } from './richHtmlToDocx';

const FONT = 'Calibri';
const SIZE_BODY = 20; // 10pt
const SIZE_H1 = 22; // 11pt
const SIZE_AREA = 24; // 12pt
const SIZE_ITEM = 22; // 11pt para H3

export async function buildDocDesdeRich(
    secciones: SeccionAreaRich[],
    tituloDocumento: string
): Promise<Document> {
    const children: Paragraph[] = [];

    // Título global (H1: Calibri 11, negrita)
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: tituloDocumento,
                    bold: true,
                    font: FONT,
                    size: SIZE_H1,
                    color: '000000',
                }),
            ],
            heading: HeadingLevel.HEADING_1,
        })
    );

    for (const sec of secciones) {
        // Título de área (Calibri 12, negro, negrita)
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: sec.areaNovedad,
                        bold: true,
                        font: FONT,
                        size: SIZE_AREA,
                        color: '000000',
                    }),
                ],
                heading: HeadingLevel.HEADING_2,
            })
        );

        for (const item of sec.items) {
            // Título de novedad (Calibri 11, negrita)
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: item.tituloNovedad,
                            bold: true,
                            font: FONT,
                            size: SIZE_ITEM,
                            color: '000000',
                        }),
                    ],
                    heading: HeadingLevel.HEADING_3,
                })
            );

            // Contenido HTML → bloques docx (usa body: Calibri 10)
            const bloques = await htmlToDocxBlocks(item.detalleHtml, {
                maxImageWidth: 420,
                maxImageHeight: 280,
            });

            bloques.forEach((b) => children.push(b));
        }
    }

    return new Document({ sections: [{ children }] });
}

/** Mantiene compatibilidad para tu hook */
export async function createNovedadesDoc(
    input: BuildDocRichInput
): Promise<Document> {
    const { sectorGeneral, novedad, confidentialityLabel } = input;
    const titulo = `${confidentialityLabel} — ${sectorGeneral}`;
    return buildDocDesdeRich(novedad, titulo);
}
