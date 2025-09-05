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
    TableLayoutType, // 👈 necesario para ancho 100% real
} from 'docx';
import { COLORS } from './colors';
/** Paleta base (podés mover a colors.ts si preferís) */

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
                        size: 20, // ~9pt (opcional)
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
                        size: 20, // ~9pt (opcional)
                    }),
                ],
            }),
        ],
    });
}

/** Franja "area" con fondo celeste y borde azul
 *  Estilo: bold, ~15px (≈ 11.25pt => size:22), color negro
 */
export function makeareaBox(areaTitle: string): Table {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED, // ancho 100% real
        alignment: AlignmentType.LEFT, // pegado al margen
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        borders: {
                            top: {
                                style: BorderStyle.SINGLE,
                                size: 8,
                                color: COLORS.areaBorder,
                            }, // fino
                            bottom: {
                                style: BorderStyle.SINGLE,
                                size: 8,
                                color: COLORS.areaBorder,
                            },
                            left: {
                                style: BorderStyle.SINGLE,
                                size: 8,
                                color: COLORS.areaBorder,
                            },
                            right: {
                                style: BorderStyle.SINGLE,
                                size: 8,
                                color: COLORS.areaBorder,
                            },
                        },
                        shading: {
                            type: ShadingType.CLEAR,
                            fill: COLORS.areaFill,
                            color: 'auto',
                        },
                        // margen interno mínimo para no “pegar” al borde
                        margins: { top: 60, bottom: 60, left: 80, right: 80 }, // twips
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: areaTitle,
                                        bold: true,
                                        color: '000000',
                                        size: 30, // ≈ 15px
                                    }),
                                ],
                                spacing: { before: 0, after: 0 }, // compacto
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

/** Encabezado del área (ej. "POWER APPS") */
export function areaHeading(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                color: '000000',
                size: 22, // ≈ 11px
            }),
        ],
        spacing: { before: 200, after: 100 },
    });
}

/** Título de novedad (ítem) */
export function noveltyTitle(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                color: COLORS.itemTitle, // #153D63
                size: 22,
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
                size: 22, // ≈ 10pt
            }),
        ],
        spacing: { after: 120 },
    });
}
