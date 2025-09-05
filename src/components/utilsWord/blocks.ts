import {
    AlignmentType,
    BorderStyle,
    Footer,
    Header,
    ImageRun,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableLayoutType,
    TableRow,
    TextRun,
    UnderlineType,
    WidthType,
} from 'docx';
import { COLORS } from './colors';

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
                        size: 22, // ~11pt
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
                        size: 20, // ~10pt
                    }),
                ],
            }),
        ],
    });
}

/** Franja "area" con fondo celeste y borde azul */
export function makeareaBox(areaTitle: string): Table {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        alignment: AlignmentType.LEFT,
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        borders: {
                            top: {
                                style: BorderStyle.SINGLE,
                                size: 8,
                                color: COLORS.areaBorder,
                            },
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
                        margins: { top: 60, bottom: 60, left: 80, right: 80 },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: areaTitle,
                                        bold: true,
                                        color: '000000',
                                        size: 30,
                                    }),
                                ],
                                spacing: { before: 0, after: 0 },
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
            },
        },
        spacing: { before: 120, after: 120 },
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
                size: 22,
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

/** Detalle/Descripción del ítem */
export function noveltyDetail(text: string): Paragraph {
    return new Paragraph({
        children: [new TextRun({ text, color: COLORS.greyText, size: 22 })],
        spacing: { after: 120 },
    });
}

/** Galería de imágenes (2 por fila por defecto)
 *  Recibe binarios (Uint8Array) y arma una tabla con bordes finos por imagen.
 */
export function imageGallery(
    imageData: Uint8Array[],
    opts?: { perRow?: number; width?: number; height?: number }
): Table {
    const perRow = opts?.perRow ?? 2;
    const w = opts?.width ?? 250; // px aproximados en docx
    const h = opts?.height ?? 160;

    // Chunks de perRow
    const rows: TableRow[] = [];
    for (let i = 0; i < imageData.length; i += perRow) {
        const slice = imageData.slice(i, i + perRow);

        const cells = slice.map(
            (data) =>
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.SINGLE,
                            size: 8,
                            color: COLORS.thinLine,
                        },
                        bottom: {
                            style: BorderStyle.SINGLE,
                            size: 8,
                            color: COLORS.thinLine,
                        },
                        left: {
                            style: BorderStyle.SINGLE,
                            size: 8,
                            color: COLORS.thinLine,
                        },
                        right: {
                            style: BorderStyle.SINGLE,
                            size: 8,
                            color: COLORS.thinLine,
                        },
                    },
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new ImageRun({
                                    data,
                                    transformation: { width: w, height: h },
                                    type: 'png', // or 'jpeg' depending on your image format
                                }),
                            ],
                        }),
                    ],
                })
        );

        // Si la última fila no completa el perRow, agregamos celdas vacías para mantener ancho
        while (cells.length < perRow) {
            cells.push(
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.SINGLE,
                            size: 8,
                            color: COLORS.thinLine,
                        },
                        bottom: {
                            style: BorderStyle.SINGLE,
                            size: 8,
                            color: COLORS.thinLine,
                        },
                        left: {
                            style: BorderStyle.SINGLE,
                            size: 8,
                            color: COLORS.thinLine,
                        },
                        right: {
                            style: BorderStyle.SINGLE,
                            size: 8,
                            color: COLORS.thinLine,
                        },
                    },
                    children: [new Paragraph({})],
                })
            );
        }

        rows.push(new TableRow({ children: cells }));
    }

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        rows,
    });
}
