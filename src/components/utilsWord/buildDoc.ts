// src/components/utilsWord/buildDoc.ts
import { Document, Paragraph, Table } from 'docx';
import {
    buildFooter,
    buildHeader,
    makeSectorBox,
    areaHeading,
    noveltyDetail,
    noveltyTitle,
    thinSeparator,
} from './blocks';
import type { AreaSection, BuildDocInput } from './types';

// ---- helper interno ----
function buildSections(
    sections: AreaSection[],
    maxItems: number
): (Paragraph | Table)[] {
    const out: (Paragraph | Table)[] = [];

    for (const { title, items } of sections) {
        const limited = items.slice(0, maxItems);

        // título del área
        out.push(areaHeading(title));

        // items
        limited.forEach(({ title: t, desc }, idx) => {
            out.push(noveltyTitle(t));
            out.push(noveltyDetail(desc));
            if (idx < limited.length - 1) out.push(thinSeparator());
        });

        // espacio al final de cada bloque
        out.push(new Paragraph({ spacing: { after: 200 } }));
    }

    return out;
}

// ---- builder principal ----
export function createNovedadesDoc(input: BuildDocInput): Document {
    const {
        sectorTitle,
        sections,
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
                    makeSectorBox(sectorTitle),
                    ...buildSections(sections, maxItemsPerSection),
                ],
            },
        ],
    });
}

export default createNovedadesDoc;
