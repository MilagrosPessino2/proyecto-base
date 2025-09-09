// src/components/utilsWord/buildDocx.ts
import type { SeccionAreaRich, BuildDocRichInput } from './types';
import { htmlToDocxBlocks } from './richHtmlToDocx';
import { buildHeader, buildFooter, buildSectorBox } from './blocks';
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
    const children: (Paragraph | Table)[] = [];

    // Caja con el sector general (Table)
    const sectorBox = buildSectorBox(sectorGeneral) as unknown as Table;

    // --- Agregamos la caja y un espaciado debajo ---
    children.push(sectorBox);
    children.push(
        new Paragraph({
            spacing: { after: 100 }, // ≈20pt de espacio después del box
        })
    );

    for (const sec of secciones) {
        // Título de área con espacio después (Calibri 12, negro, negrita)
        children.push(
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { after: 200 }, // ≈10pt después del área
                children: [
                    new TextRun({
                        text: sec.areaNovedad,
                        font: FONT,
                        size: SIZE_AREA,
                        color: '000000',
                        bold: true,
                    }),
                ],
            })
        );

        // Items de la sección
        for (const item of sec.items) {
            const bloques = await htmlToDocxBlocks(item.richHtml, {
                maxImageWidth: 420,
                maxImageHeight: 280,
            });
            children.push(...bloques);

            // Línea separadora debajo de cada novedad + aire
            children.push(
                new Paragraph({
                    border: {
                        bottom: {
                            style: BorderStyle.SINGLE,
                            size: 6,
                            color: '999999',
                        },
                    },
                    spacing: { before: 200, after: 200 },
                })
            );
        }
    }

    return new Document({
        sections: [
            {
                headers: { default: buildHeader(confidentialityLabel) },
                footers: { default: buildFooter(confidentialityLabel) },
                children,
            },
        ],
    });
}

export async function createNovedadesDoc(
    input: BuildDocRichInput
): Promise<Document> {
    const { sectorGeneral, novedad, confidentialityLabel } = input;
    return buildDocDesdeRich(novedad, sectorGeneral, confidentialityLabel);
}
