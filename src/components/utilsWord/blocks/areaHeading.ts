import { Paragraph, TextRun } from 'docx';

/** Encabezado del área (ej. "POWER APPS") */
export function areaHeading(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: text.toUpperCase(),
                bold: true,
                color: '000000',
                size: 22,
            }),
        ],
        spacing: { before: 200, after: 100 },
    });
}
