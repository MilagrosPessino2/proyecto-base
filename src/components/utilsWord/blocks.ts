import {
    Header,
    Footer,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    ShadingType,
    BorderStyle,
} from 'docx';

const FONT = 'Calibri';
const SIZE_CONF = 20; // 10pt
const SIZE_AREA = 24; // 12pt

/** Header con "YPF-Confidencial" a la derecha, Calibri 10 sin negrita */
export function buildHeader(confidentialLabel = 'YPF-Confidencial') {
    return new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                    new TextRun({
                        text: confidentialLabel,
                        font: FONT,
                        size: SIZE_CONF,
                        color: '000000',
                    }),
                ],
            }),
        ],
    });
}

/** Footer con "YPF-Confidencial" a la derecha, Calibri 10 sin negrita */
export function buildFooter(confidentialLabel = 'YPF-Confidencial') {
    return new Footer({
        children: [
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                    new TextRun({
                        text: confidentialLabel,
                        font: FONT,
                        size: SIZE_CONF,
                        color: '000000',
                    }),
                ],
            }),
        ],
    });
}

/** Caja para el Sector General (fondo suave + borde, Calibri 12 negrita negro) */
export function buildSectorBox(texto: string) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: {
                            type: ShadingType.CLEAR,
                            fill: 'E7EEF8',
                            color: 'auto',
                        }, // celeste suave
                        borders: {
                            top: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: '255c8f',
                            },
                            bottom: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: '255c8f',
                            },
                            left: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: '255c8f',
                            },
                            right: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: '255c8f',
                            },
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: texto,
                                        bold: true,
                                        font: FONT,
                                        size: 30,
                                        color: '000000',
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
}
