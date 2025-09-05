export interface NoveltyItem {
    title: string;
    desc: string;
}

export interface AreaSection {
    /** Ej: "POWER APPS" */
    title: string;
    /** Máx. 3 items se aplicará en el builder, pero podés pasar más */
    items: NoveltyItem[];
}

export interface BuildDocInput {
    /** Texto del sector (franja celeste con borde) */
    sectorTitle: string;
    /** Secciones de contenido (áreas) */
    sections: AreaSection[];
    /** Límite de items por sección (default 3) */
    maxItemsPerSection?: number;
    /** Nombre a mostrar en header/footer (default "YPF-Confidencial") */
    confidentialityLabel?: string;
}
