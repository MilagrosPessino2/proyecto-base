import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import {
    ACCEPT_IMAGES,
    Archivo,
    IFileAdd,
    isSupportedImage,
} from '../../utils/constants';
import styles from './AdjuntarArchivos.module.scss';
import { useEffect, useRef, useState } from 'react';

// Props para comunicar los archivos seleccionados al componente padre
interface AdjuntarArchivosPreviaProps {
    setFiles: React.Dispatch<React.SetStateAction<IFileAdd[]>>;
}

const AdjuntarArchivos: React.FC<AdjuntarArchivosPreviaProps> = ({
    setFiles,
}) => {
    const [archivos, setArchivos] = useState<Archivo[]>([]); // Estado local para manejar los archivos
    const idCounter = useRef(0); // Contador para generar IDs únicos

    // Limpiar URLs de blobs al desmontar el componente,
    // un blob es una URL temporal para previsualizar archivos
    useEffect(() => {
        return () => {
            archivos.forEach((a) => a.url && URL.revokeObjectURL(a.url));
        };
    }, []);

    useEffect(() => {
        // Convertir los archivos locales al formato esperado por el componente padre
        const convertidos: IFileAdd[] = archivos.map((archivo) => ({
            id: archivo.id,
            file: archivo.file!, // ✅ File real
            ServerRelativeUrl: archivo.url,
            added: false,
            deleted: false,
        }));

        setFiles(convertidos);
    }, [archivos]);

    // Manejar la selección de archivos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const nuevos: Archivo[] = [];
        const existentes = new Set(archivos.map((a) => a.fileKey));
        const agregadosAhora = new Set<string>();
        const duplicados: string[] = [];

        for (const f of files) {
            const fileKey = `${f.name}|${f.size}|${f.lastModified}`;
            const esDuplicado =
                existentes.has(fileKey) || agregadosAhora.has(fileKey);

            if (esDuplicado) {
                duplicados.push(f.name);
            } else {
                const esImagen = isSupportedImage(f);
                const id = `${Date.now()}-${idCounter.current++}`;
                const url = esImagen ? URL.createObjectURL(f) : undefined;

                nuevos.push({
                    id,
                    nombre: f.name,
                    esImagen,
                    url,
                    fileKey,
                    file: f, // ✅ Guarda el File original
                });

                agregadosAhora.add(fileKey);
            }
        }

        if (nuevos.length) setArchivos((prev) => [...nuevos, ...prev]); // Añadir al inicio
        e.target.value = '';
    };

    return (
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 16 } }}>
            <div className={styles.toolbarContainer}>
                <div className={styles.toolbar}>
                    <div className={styles.uploadBtnWrapper}>
                        <PrimaryButton text='Adjuntar archivos' />
                        <input
                            type='file'
                            multiple
                            accept={ACCEPT_IMAGES}
                            onChange={handleChange}
                            className={styles.overlayInput}
                            tabIndex={-1}
                            aria-hidden='true'
                        />
                    </div>
                </div>
            </div>
        </Stack>
    );
};

export default AdjuntarArchivos;
