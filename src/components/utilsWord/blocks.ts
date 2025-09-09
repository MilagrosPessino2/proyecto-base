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
import { COLOR_TOKENS } from './colors';

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
                        color: COLOR_TOKENS.textoDetalleNovedad,
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
                        color: COLOR_TOKENS.textoDetalleNovedad,
                    }),
                ],
            }),
        ],
    });
}

/** Caja para el Sector General (fondo suave + borde, Calibri 12 negrita) */
export function buildSectorBox(texto: string) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        shading: {
                            type: ShadingType.CLEAR,
                            fill: COLOR_TOKENS.fondoArea,
                            color: 'auto',
                        },
                        borders: {
                            top: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: COLOR_TOKENS.bordeArea,
                            },
                            bottom: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: COLOR_TOKENS.bordeArea,
                            },
                            left: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: COLOR_TOKENS.bordeArea,
                            },
                            right: {
                                style: BorderStyle.SINGLE,
                                size: 16,
                                color: COLOR_TOKENS.bordeArea,
                            },
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: texto,
                                        bold: true,
                                        font: FONT,
                                        size: SIZE_AREA,
                                        color: COLOR_TOKENS.textoDetalleNovedad,
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
