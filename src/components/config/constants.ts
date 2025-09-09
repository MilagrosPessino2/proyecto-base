// Nombre de archivo por defecto
export const DOCX_FILENAME = 'Novedades_YPF.docx' as const;

// Texto fijo de confidencialidad (Header/Footer)
export const DOCX_CONFIDENTIAL_LABEL = 'YPF-Confidencial' as const;

// Tipografía
export const DOCX_FONT = 'Calibri' as const;

// Tamaños de fuente (half-points, como usa "docx")
export const DOCX_FONT_SIZES = {
    body: 20, // 10pt (texto general)
    h1: 22, // 11pt (título dentro del item)
    area: 24, // 12pt (título de área)
    confidential: 20, // 10pt (header/footer)
} as const;

// Espaciados (twips; 20 twips = 1pt)
export const DOCX_SPACING = {
    afterSectorBox: 120, // ≈ 6pt debajo de la caja del sector
    afterAreaTitle: 200, // ≈10pt debajo del título de área
    separatorBeforeAfter: 200, // ≈10pt antes y después del separador
    imageBefore: 20, // ≈ 1pt antes de la imagen (suave)
    imageGapAfter: 40, // ≈ 2pt de aire tras cada imagen
} as const;

// Imágenes (límite en px; se respeta proporción)
export const DOCX_IMAGES = {
    maxWidth: 420,
    maxHeight: 280,
} as const;

// Bordes (eighths of a point)
export const DOCX_BORDERS = {
    separatorLineSize: 6, // línea separadora entre novedades
    sectorBorderSize: 16, // borde de la caja de sector
} as const;
