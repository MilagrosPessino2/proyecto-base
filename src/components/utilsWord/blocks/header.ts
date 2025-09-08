import { AlignmentType, Header, Paragraph, TextRun } from 'docx';
import { COLOR_TOKENS } from '../colors';

/** Header reutilizable (texto a la derecha) */
export function buildHeader(label: string): Header {
    return new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                    new TextRun({
                        text: label,
                        color: COLOR_TOKENS.textoDetalleNovedad,
                        size: 20,
                    }),
                ],
            }),
        ],
    });
}
