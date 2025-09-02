export const Roles = {
    ADMINISTRADORES: 'ADMINISTRADORES',
    OTRO: 'OTRO',
} as const;
export type Role = (typeof Roles)[keyof typeof Roles];
// Enum de formatos permitidos
export enum Formatos {
    JPEG = 'jpeg',
    JPG = 'jpg',
    PNG = 'png',
}

export const ACCEPT_IMAGES = Object.values(Formatos)
    .map((ext) => `.${ext}`)
    .join(',');

// Función auxiliar para obtener extensión
function getFileExtension(nombre: string): string {
    return (nombre.split('.').pop() || '').toLowerCase();
}

// Validador
export function isSupportedImage(file: File): boolean {
    const ext = getFileExtension(file.name);
    return Object.values(Formatos).includes(ext as Formatos);
}

export interface IFileAdd {
    id: string;
    file: File;
    ServerRelativeUrl?: string;
    added: boolean;
    deleted: boolean;
}

export interface Archivo {
    id: string;
    nombre: string;
    esImagen: boolean;
    url?: string;
    fileKey: string;
    file?: File;
}
