import {
    AlignmentType,
    BorderStyle,
    IImageOptions,
    ImageRun,
    Paragraph,
    Table,
    TableCell,
    TableLayoutType,
    TableRow,
    WidthType,
} from 'docx';
import { compareByArea } from '../compareArea';

/** Helper para forzar el overload correcto de ImageRun (binario, no SVG) */
function asImageOptions(
    data: Uint8Array,
    width: number,
    height: number
): IImageOptions {
    return {
        data: data as unknown as Uint8Array,
        transformation: { width, height },
    } as unknown as IImageOptions;
}

/* ===== Helpers para tabla/celdas SIN bordes ===== */
const NO_CELL_BORDERS = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
} as const;

const NO_TABLE_BORDERS = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
} as const;

/** Galería en UNA sola columna:
 *  - Ordena imágenes de menor a mayor área (y desempata por alto/ ancho).
 *  - Centra cada imagen horizontalmente.
 *  - Una imagen por fila.
 */
export function imageGallery(
    images: { data: Uint8Array; width: number; height: number }[]
): Table {
    // Copiamos y ordenamos (no mutar el array original)
    const ordered = [...images].sort(compareByArea);

    // Una fila por imagen, 1 celda centrada
    const rows: TableRow[] = ordered.map(
        ({ data, width, height }) =>
            new TableRow({
                children: [
                    new TableCell({
                        borders: NO_CELL_BORDERS,
                        margins: {
                            top: 120,
                            bottom: 120,
                            left: 120,
                            right: 120,
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new ImageRun(
                                        asImageOptions(data, width, height)
                                    ),
                                ],
                            }),
                        ],
                    }),
                ],
            })
    );

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: NO_TABLE_BORDERS,
        rows,
    });
}
