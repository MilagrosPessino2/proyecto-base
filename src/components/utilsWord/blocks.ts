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
    IImageOptions,
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

/* ===== Helpers para galería sin bordes ===== */
const NO_CELL_BORDERS = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
} as const;

const NO_TABLE_BORDERS = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
} as const;

/** Cast seguro para `ImageRun` (evita errores de overload) */
function toImageOptions(
    data: Uint8Array,
    width: number,
    height: number
): IImageOptions {
    return {
        data: data as unknown as Uint8Array, // 👈 OJO: sin genéricos
        transformation: { width, height },
    } as IImageOptions;
}

/** Galería de imágenes (centrada con 1 img, 2 por fila si hay 2+) */
export function imageGallery(
    imageData: Uint8Array[],
    opts?: { perRow?: number; width?: number; height?: number }
): Table {
    const perRow = Math.max(1, opts?.perRow ?? 2);
    const w = opts?.width ?? 250;
    const h = opts?.height ?? 160;

    // 1 sola imagen → centrada, ocupando toda la fila, sin bordes
    if (imageData.length === 1) {
        const data = imageData[0];
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            borders: NO_TABLE_BORDERS,
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            columnSpan: perRow,
                            borders: NO_CELL_BORDERS,
                            margins: {
                                top: 120,
                                bottom: 120,
                                left: 120,
                                right: 120,
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new ImageRun(
                                            toImageOptions(data, w, h)
                                        ),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });
    }

    // 2 o más imágenes → grilla perRow, sin bordes
    const rows: TableRow[] = [];
    for (let i = 0; i < imageData.length; i += perRow) {
        const slice = imageData.slice(i, i + perRow);

        const cells = slice.map(
            (data) =>
                new TableCell({
                    borders: NO_CELL_BORDERS,
                    margins: { top: 120, bottom: 120, left: 120, right: 120 },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new ImageRun(toImageOptions(data, w, h)),
                            ],
                        }),
                    ],
                })
        );

        while (cells.length < perRow) {
            cells.push(
                new TableCell({
                    borders: NO_CELL_BORDERS,
                    children: [new Paragraph({})],
                })
            );
        }

        rows.push(new TableRow({ children: cells }));
    }

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: NO_TABLE_BORDERS,
        rows,
    });
}
