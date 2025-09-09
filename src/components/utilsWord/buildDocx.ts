import { Document, Paragraph, HeadingLevel } from 'docx';
import type { SeccionAreaRich, BuildDocRichInput } from './types';
import { htmlToDocxBlocks } from './richHtmlToDocx';

export async function buildDocDesdeRich(
    secciones: SeccionAreaRich[],
    tituloDocumento: string
): Promise<Document> {
    const children: Paragraph[] = [];

    // Título global
    children.push(
        new Paragraph({
            text: tituloDocumento,
            heading: HeadingLevel.HEADING_1,
        })
    );

    for (const sec of secciones) {
        // Título de área
        children.push(
            new Paragraph({
                text: sec.areaNovedad,
                heading: HeadingLevel.HEADING_2,
            })
        );

        for (const item of sec.items) {
            // Título de novedad
            children.push(
                new Paragraph({
                    text: item.tituloNovedad,
                    heading: HeadingLevel.HEADING_3,
                })
            );

            // Contenido HTML → bloques docx
            const bloques = await htmlToDocxBlocks(item.detalleHtml, {
                maxImageWidth: 420,
                maxImageHeight: 280,
            });

            // Agregar al documento
            bloques.forEach((b) => children.push(b));
        }
    }

    return new Document({
        sections: [{ children }],
    });
}

/**
 * Wrapper exportado para mantener compatibilidad con useNovedadesDownload:
 * recibe el input RICH y construye el Document.
 */
export async function createNovedadesDoc(
    input: BuildDocRichInput
): Promise<Document> {
    const { sectorGeneral, novedad, confidentialityLabel } = input;

    // Podés decidir cómo armar el título; acá uso la etiqueta de confidencialidad + sector
    const titulo = `${confidentialityLabel} — ${sectorGeneral}`;

    return buildDocDesdeRich(novedad, titulo);
}
