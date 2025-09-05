import {
    AlignmentType,
    BorderStyle,
    Footer,
    Header,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableRow,
    TextRun,
    UnderlineType,
    WidthType,
} from 'docx';

/** Paleta base (podés mover a colors.ts si preferís) */
const COLORS = {
    sectorBorder: '2F5597',
    sectorFill: 'D9E2F3',
    thinLine: '000000',
    greyText: '666666',
    itemTitle: '153D63', // #153D63 (sin # para docx)
};

/** Header reutilizable (texto a la derecha) */
export function buildHeader(label: string): Header {
    return new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                    new TextRun({
                        text: label,
                        color: COLORS.greyText,
                        bold: true,
                        size: 18, // ~9pt (opcional)
                    }),
                ],
            }),
        ],
    });
}

/** Footer reutilizable (centrado) */
export function buildFooter(label: string): Footer {
    return new Footer({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: label,
                        color: COLORS.greyText,
                        size: 18, // ~9pt (opcional)
                    }),
                ],
            }),
        ],
    });
}

/** Franja "Sector" con fondo celeste y borde azul
 *  Estilo: bold, ~15px (≈ 11.25pt => size:22), color negro
 */
export function makeSectorBox(sectorTitle: string): Table {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [100],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: COLORS.sectorBorder,
                            },
                            bottom: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: COLORS.sectorBorder,
                            },
                            left: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: COLORS.sectorBorder,
                            },
                            right: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: COLORS.sectorBorder,
                            },
                        },
                        shading: {
                            type: ShadingType.CLEAR,
                            fill: COLORS.sectorFill,
                            color: 'auto',
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: sectorTitle,
                                        bold: true,
                                        color: '000000',
                                        size: 22, // ✅ ~15px
                                    }),
                                ],
                                spacing: { before: 120, after: 120 },
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
}

/** Línea separadora fina (negra) entre items */
export function thinSeparator(): Paragraph {
    return new Paragraph({
        border: {
            bottom: {
                style: BorderStyle.SINGLE,
                size: 8,
                color: COLORS.thinLine,
            }, // ~1pt
        },
        spacing: { before: 200, after: 200 },
    });
}

/** Encabezado del área (ej. "POWER APPS")
 *  Estilo: bold, ~11px (≈ 8.25pt => size:16), color negro
 */
export function areaHeading(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                color: '000000',
                size: 16, // ✅ ~11px
            }),
        ],
        spacing: { before: 200, after: 100 },
    });
}

/** Título de novedad (ítem)
 *  Estilo: bold, ~11px (≈ 8.25pt => size:16), color #153D63, SIN subrayado
 */
export function noveltyTitle(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                color: COLORS.itemTitle, // #153D63
                size: 16, // ✅ ~11px
                underline: { type: UnderlineType.NONE },
            }),
        ],
        spacing: { after: 60 },
    });
}

/** Detalle/Descripción del ítem
 *  Estilo: gris, un poco más chico para jerarquía (≈ 10pt => size:20)
 */
export function noveltyDetail(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                color: COLORS.greyText,
                size: 20, // ~10pt (si querés lo bajo a 18/16)
            }),
        ],
        spacing: { after: 120 },
    });
}
