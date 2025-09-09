// ==== Tipos "clásicos" (si los seguís usando en otra parte) ====
export interface ItemNovedad {
    tituloNovedad: string;
    detalleNovedad: string;
    imagenesNovedad?: string[];
}
export interface SeccionArea {
    areaNovedad: string;
    items: ItemNovedad[];
}

// ==== Tipos RICH (HTML) ====
// NUEVO: el título viene dentro del HTML (ej. <h1>...).
export interface ItemRich {
    /** HTML enriquecido completo: puede incluir <h1>, p/strong/em/u, ul/ol/li, img (dataURL o URL), etc. */
    richHtml: string;
}
export interface SeccionAreaRich {
    areaNovedad: string; // encabezado de sección (fuera del HTML del ítem)
    items: ItemRich[]; // cada item contiene TODO su contenido dentro de richHtml
}

/** Input "clásico" (si existía) */
export interface BuildDocInput {
    sectorGeneral: string;
    novedad: SeccionArea[];
    confidentialityLabel: string;
    maxItemsPerSection?: number;
}

/** Input RICH (nuevo, recomendado) */
export interface BuildDocRichInput {
    sectorGeneral: string;
    novedad: SeccionAreaRich[];
    confidentialityLabel: string;
    maxItemsPerSection?: number;
}
