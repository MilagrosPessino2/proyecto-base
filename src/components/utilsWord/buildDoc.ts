// src/components/utilsWord/buildDoc.ts
import { Document, Paragraph, Table } from 'docx';
import {
    buildFooter,
    buildHeader,
    makeareaBox,
    areaHeading,
    noveltyDetail,
    noveltyTitle,
    thinSeparator,
} from './blocks';
import type { areaSection, BuildDocInput } from './types';

// ---- builder principal ----
export function createNovedadesDoc(input: BuildDocInput): Document {
    const {
        areaTitle,
        novedad,
        maxItemsPerSection = 3,
        confidentialityLabel = 'YPF-Confidencial',
    } = input;

    return new Document({
        styles: {
            default: {
                document: {
                    run: { font: 'Calibri' }, // 👈 fuente global del .docx
                    paragraph: { spacing: { line: 276 } }, // opcional (~1.15)
                },
            },
        },
        sections: [
            {
                headers: { default: buildHeader(confidentialityLabel) },
                footers: { default: buildFooter(confidentialityLabel) },
                children: [
                    makeareaBox(areaTitle),
                    ...buildSections(novedad, maxItemsPerSection),
                ],
            },
        ],
    });
}

// ---- helper interno ----
function buildSections(
    sections: areaSection[],
    maxItems: number
): (Paragraph | Table)[] {
    const out: (Paragraph | Table)[] = [];

    for (const { gerencia, items } of sections) {
        const limited = items.slice(0, maxItems);

        // título del área
        out.push(areaHeading(gerencia));

        // items
        limited.forEach(({ titulo: t, resumen }, idx) => {
            out.push(noveltyTitle(t));
            out.push(noveltyDetail(resumen));
            if (idx < limited.length - 1) out.push(thinSeparator());
        });

        // espacio al final de cada bloque
        out.push(new Paragraph({ spacing: { after: 200 } }));
    }

    return out;
}

export default createNovedadesDoc;
