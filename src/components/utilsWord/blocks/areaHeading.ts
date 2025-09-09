import { Paragraph, TextRun } from 'docx';
import { COLOR_TOKENS, TAMANIO } from '../../config/constants';

/** Encabezado del área (ej. "POWER APPS") */
export function areaHeading(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                color: COLOR_TOKENS.textoNegro,
                size: TAMANIO.tamanioTittle,
            }),
        ],
        spacing: { before: 200, after: 100 },
    });
}
