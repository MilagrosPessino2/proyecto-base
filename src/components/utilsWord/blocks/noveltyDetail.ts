import { Paragraph, TextRun } from 'docx';
import { COLOR_TOKENS, TAMANIO } from '../../config/constants';

/** Detalle/Descripción del ítem */
export function noveltyDetail(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                color: COLOR_TOKENS.textoDetalleNovedad,
                size: TAMANIO.tamanioTextoDetalleNovedad,
            }),
        ],
        spacing: { after: 120 },
    });
}
