export interface NoveltyItem {
    titulo: string;
    resumen: string;
    imagenes?: string[];
}

export interface areaSection {
    gerencia: string;
    items: NoveltyItem[];
}

export interface BuildDocInput {
    areaTitle: string;
    novedad: areaSection[];
    maxItemsPerSection?: number;
    confidentialityLabel?: string;
}
