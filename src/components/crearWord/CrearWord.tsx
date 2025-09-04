import React from 'react';
import {
    AlignmentType,
    BorderStyle,
    Document,
    Footer,
    Header,
    HeadingLevel,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    WidthType,
    TextRun,
    ShadingType,
    UnderlineType,
} from 'docx';

const COLORS = {
    sectorBorder: '2F5597', // azul oscuro (borde sector)
    sectorFill: 'D9E2F3', // celeste claro (fondo sector)
    titleBlue: '2F5597', // azul para títulos de novedad
    greyText: '666666', // gris para detalles
    thinLine: '000000', // separador
};

const CrearWord: React.FC = () => {
    const handleDownload = async () => {
        const doc = new Document({
            sections: [
                {
                    // Header & Footer fijos
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [
                                        new TextRun({
                                            text: 'YPF-Confidencial',
                                            color: COLORS.greyText,
                                            bold: true,
                                            size: 18, // 9pt
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },
                    footers: {
                        default: new Footer({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: 'YPF-Confidencial',
                                            color: COLORS.greyText,
                                            size: 18, // 9pt
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },

                    children: [
                        // Caja de "Sector" (como la franja del screenshot)
                        makeSectorBox('Diseño y comunicacion'),

                        // Bloques (máx. 3 items)
                        ...buildEntry('POWER APPS', [
                            {
                                title: 'ESTA ES UNA NOVEDAD DE SA',
                                desc: 'Prueba de Novedad novedosa',
                            },
                            {
                                title: 'OTRA NOVEDAD',
                                desc: 'Elevo una Novedad para que genere en Elevadas',
                            },
                            { title: 'TEST', desc: 'prueba' },
                            {
                                title: 'EXTRA (no debería verse)',
                                desc: 'supera el máximo',
                            }, // se recorta a 3
                        ]),

                        ...buildEntry('NUEVA AREA DE PRUEBA', [
                            { title: 'ELEV', desc: 'aa' },
                            { title: 'NOVEDAD 3/9', desc: 'res' },
                        ]),

                        ...buildEntry('DISEÑO Y COMUNICACION', [
                            {
                                title: 'NOVEDADNUEVA02/09',
                                desc: 'soy un resumen resumido',
                            },
                        ]),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Novedades_YPF.docx';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // ================== Layout Helpers ===================

    // Franja del "Sector" con fondo celeste y borde azul
    const makeSectorBox = (sectorTitle: string): Table => {
        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [100],
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            borders: {
                                top: {
                                    style: BorderStyle.SINGLE,
                                    size: 16,
                                    color: COLORS.sectorBorder,
                                },
                                bottom: {
                                    style: BorderStyle.SINGLE,
                                    size: 16,
                                    color: COLORS.sectorBorder,
                                },
                                left: {
                                    style: BorderStyle.SINGLE,
                                    size: 16,
                                    color: COLORS.sectorBorder,
                                },
                                right: {
                                    style: BorderStyle.SINGLE,
                                    size: 16,
                                    color: COLORS.sectorBorder,
                                },
                            },
                            shading: {
                                type: ShadingType.CLEAR,
                                fill: COLORS.sectorFill,
                                color: 'auto',
                            },
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: sectorTitle,
                                            bold: true,
                                            color: '000000',
                                        }),
                                    ],
                                    spacing: { before: 120, after: 120 },
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });
    };

    // Línea separadora fina (negra)
    const thinSeparator = () =>
        new Paragraph({
            border: {
                bottom: {
                    style: BorderStyle.SINGLE,
                    size: 8,
                    color: COLORS.thinLine,
                }, // ~1pt
            },
            spacing: { before: 200, after: 200 },
        });

    // Encabezado del área (ej. "POWER APPS")
    const areaHeading = (text: string) =>
        new Paragraph({
            text: text.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
        });

    // Título de novedad (azul subrayado)
    const noveltyTitle = (text: string) =>
        new Paragraph({
            children: [
                new TextRun({
                    text: text.toUpperCase(),
                    color: COLORS.titleBlue,
                    underline: { type: UnderlineType.SINGLE },
                    bold: false,
                }),
            ],
            spacing: { after: 60 },
        });

    // Detalle (gris)
    const noveltyDetail = (text: string) =>
        new Paragraph({
            children: [new TextRun({ text, color: COLORS.greyText })],
            spacing: { after: 120 },
        });

    // Bloque de área con N (máx. 3) items, con línea fina entre items
    const buildEntry = (
        sectionTitle: string,
        items: { title: string; desc: string }[]
    ) => {
        const out: (Paragraph | Table)[] = [];
        const limited = items.slice(0, 3); // <= 3 items

        // Título del área una sola vez
        out.push(areaHeading(sectionTitle));

        limited.forEach(({ title, desc }, idx) => {
            out.push(noveltyTitle(title));
            out.push(noveltyDetail(desc));

            // Separador entre items, excepto el último
            if (idx < limited.length - 1) {
                out.push(thinSeparator());
            }
        });

        // Espacio extra después del bloque
        out.push(new Paragraph({ spacing: { after: 200 } }));
        return out;
    };

    return (
        <div>
            <button onClick={handleDownload}>Crear y Descargar Word</button>
        </div>
    );
};

export default CrearWord;
