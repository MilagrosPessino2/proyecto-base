import { Paragraph, TextRun } from 'docx';
import { COLOR_TOKENS } from '../../config/constants';

/** Detalle/Descripción del ítem */
export function noveltyDetail(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                color: COLOR_TOKENS.textoDetalleNovedad,
                size: 22,
            }),
        ],
        spacing: { after: 120 },
    });
}
