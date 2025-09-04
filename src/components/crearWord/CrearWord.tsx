import React from 'react';
import { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, TextRun } from 'docx';

const CrearWord: React.FC = () => {
    const handleDownload = async () => {
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            text: "Título del Documento",
                            heading: HeadingLevel.HEADING_1,
                        }),
                        new Paragraph("Este es un párrafo de ejemplo."),
                        new Table({
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("Celda 1")],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Celda 2")],
                                        }),
                                    ],
                                }),
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("Celda 3")],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Celda 4")],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento.docx';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div>
            <button onClick={handleDownload}>Crear y Descargar Word</button>
        </div>
    );
};

export default CrearWord;