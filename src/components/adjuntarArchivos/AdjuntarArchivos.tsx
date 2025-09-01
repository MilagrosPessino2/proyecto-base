import { DefaultButton, PrimaryButton, Stack } from "@fluentui/react";
import { ACCEPT_IMAGES, Archivo, IFileAdd, isSupportedImage } from "../../utils/constants";
import styles from './AdjuntarArchivos.module.scss';
import { useEffect, useRef, useState } from "react";

interface AdjuntarArchivosPreviaProps {
    setFiles: React.Dispatch<React.SetStateAction<IFileAdd[]>>;
}

const AdjuntarArchivos: React.FC<AdjuntarArchivosPreviaProps> = ({ setFiles }) => {
    const [archivos, setArchivos] = useState<Archivo[]>([]);
    const idCounter = useRef(0);

    useEffect(() => {
        return () => {
            archivos.forEach((a) => a.url && URL.revokeObjectURL(a.url));
        };
    }, []);

    useEffect(() => {
        const convertidos: IFileAdd[] = archivos.map((archivo) => ({
            id: archivo.id,
            file: archivo.file!, // ✅ File real
            ServerRelativeUrl: archivo.url,
            added: false,
            deleted: false,
        }));

        setFiles(convertidos);
    }, [archivos]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const nuevos: Archivo[] = [];
        const existentes = new Set(archivos.map((a) => a.fileKey));
        const agregadosAhora = new Set<string>();
        const duplicados: string[] = [];

        for (const f of files) {
            const fileKey = `${f.name}|${f.size}|${f.lastModified}`;
            const esDuplicado = existentes.has(fileKey) || agregadosAhora.has(fileKey);

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

        
        if (nuevos.length) setArchivos((prev) => [...nuevos, ...prev]);
        e.target.value = '';
    };

    const handleClear = () => {
        archivos.forEach((a) => a.url && URL.revokeObjectURL(a.url));
        setArchivos([]);
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
 