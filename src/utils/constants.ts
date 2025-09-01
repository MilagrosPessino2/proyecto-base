export const Roles = {
    ADMINISTRADORES: 'ADMINISTRADORES',
    OTRO: 'OTRO',
} as const;
export type Role = (typeof Roles)[keyof typeof Roles];

export const MIME_BY_EXT = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    pdf: 'application/pdf',
} as const;
export type ImageExt = keyof typeof MIME_BY_EXT;
export type ImageMime = (typeof MIME_BY_EXT)[ImageExt];

const EXTS = new Set<ImageExt>(Object.keys(MIME_BY_EXT) as ImageExt[]);
const MIMES = new Set<ImageMime>(Object.values(MIME_BY_EXT));

export const ACCEPT_IMAGES = Array.from(MIMES).join(',');
export const getFileExt = (n: string) =>
    (n.split('.').pop() || '').toLowerCase();
export const isSupportedImage = (f: File) =>
    MIMES.has((f.type || '').toLowerCase() as ImageMime) ||
    EXTS.has(getFileExt(f.name) as ImageExt);

export interface IFileAdd{
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
}