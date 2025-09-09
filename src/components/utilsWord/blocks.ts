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
import {
    DOCX_FONT,
    DOCX_FONT_SIZES,
    DOCX_BORDERS,
    DOCX_CONFIDENTIAL_LABEL,
} from '../config/constants';

const FONT = DOCX_FONT;
const SIZE_CONF = DOCX_FONT_SIZES.confidential; // 10pt
const SIZE_AREA = DOCX_FONT_SIZES.area; // 12pt

/** Header con confidencial a la derecha (Calibri 10 sin negrita) */
export function buildHeader(
    confidentialLabel: string = DOCX_CONFIDENTIAL_LABEL
) {
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

/** Footer con confidencial a la derecha (Calibri 10 sin negrita) */
export function buildFooter(
    confidentialLabel: string = DOCX_CONFIDENTIAL_LABEL
) {
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

/**
 * Caja para el Sector General (fondo suave + borde corporativo).
 * Contenido: Calibri 12 negrita, color de texto corporativo.
 */
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
                                size: DOCX_BORDERS.sectorBorderSize,
                                color: COLOR_TOKENS.bordeArea,
                            },
                            bottom: {
                                style: BorderStyle.SINGLE,
                                size: DOCX_BORDERS.sectorBorderSize,
                                color: COLOR_TOKENS.bordeArea,
                            },
                            left: {
                                style: BorderStyle.SINGLE,
                                size: DOCX_BORDERS.sectorBorderSize,
                                color: COLOR_TOKENS.bordeArea,
                            },
                            right: {
                                style: BorderStyle.SINGLE,
                                size: DOCX_BORDERS.sectorBorderSize,
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
                                        size: 30,
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
