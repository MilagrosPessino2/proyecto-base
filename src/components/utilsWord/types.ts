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
export interface ItemRich {
    tituloNovedad: string;
    /** HTML enriquecido completo */
    detalleHtml: string;
}
export interface SeccionAreaRich {
    areaNovedad: string;
    items: ItemRich[];
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
