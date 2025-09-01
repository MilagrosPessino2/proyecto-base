import React, { useRef, useState, useEffect } from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import styles from './AdjuntarArchivos.module.scss';
import { Stack } from '@fluentui/react';
import { isSupportedImage, ACCEPT_IMAGES } from '../../utils/constants';

interface Archivo {
    id: string;
    nombre: string;
    esImagen: boolean;
    url?: string;
    fileKey: string;
}

const ICON_DELETE = '/delete.png';

const AdjuntarArchivos: React.FC = () => {
    const [archivos, setArchivos] = useState<Archivo[]>([]);
    const idCounter = useRef(0);
    // id único para asociar label ↔ input (sin dependencias de Fluent)
    const inputIdRef = useRef(
        `file-input-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );

    const [mostrarGaleria, setMostrarGaleria] = useState(false);

    useEffect(() => {
        return () => {
            archivos.forEach((a) => a.url && URL.revokeObjectURL(a.url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const hayImagenes = archivos.some((a) => a.esImagen && a.url);
        setMostrarGaleria(hayImagenes);
    }, [archivos]);

    // ⬇sin .click(): el <label> dispara el input nativo
    // const handleUpload = () => fileInputRef.current?.click();

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

                if (esImagen) {
                    const url = URL.createObjectURL(f);
                    nuevos.push({
                        id,
                        nombre: f.name,
                        esImagen: true,
                        url,
                        fileKey,
                    });
                } else {
                    nuevos.push({
                        id,
                        nombre: f.name,
                        esImagen: false,
                        fileKey,
                    });
                }
                agregadosAhora.add(fileKey);
            }
        }

        if (duplicados.length) {
            alert(
                `Se ignoraron archivos duplicados: ${Array.from(
                    new Set(duplicados)
                ).join(', ')}`
            );
        }

        if (nuevos.length) setArchivos((prev) => [...nuevos, ...prev]);
        e.target.value = '';
    };

    const handleRemove = (id: string) => {
        setArchivos((prev) => {
            const file = prev.find((a) => a.id === id);
            if (file?.url) URL.revokeObjectURL(file.url);
            return prev.filter((a) => a.id !== id);
        });
    };

    const handleClear = () => {
        archivos.forEach((a) => a.url && URL.revokeObjectURL(a.url));
        setArchivos([]);
    };

    const imagenes = archivos
        .filter((a) => a.esImagen && a.url)
        .map((a) => ({ id: a.id, nombre: a.nombre, url: a.url as string }));

    const renderImageCard = (file: {
        id: string;
        nombre: string;
        url: string;
    }) => (
        <div className={styles.imgCard} key={file.id}>
            <div className={styles.imgCardInner}>
                <div className={styles.imgViewport}>
                    <img
                        className={styles.cardImg}
                        src={file.url}
                        alt={file.nombre}
                    />
                </div>
            </div>

            <div className={styles.caption} title={file.nombre}>
                {file.nombre}
            </div>

            <button
                type='button'
                className={styles.removeBtn}
                aria-label={`Eliminar ${file.nombre}`}
                title='Eliminar'
                onClick={() => handleRemove(file.id)}
            >
                <img
                    src={ICON_DELETE}
                    alt=''
                    aria-hidden='true'
                    className={styles.removeIcon}
                />
            </button>
        </div>
    );

    return (
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 16 } }}>
            <div className={styles.toolbarContainer}>
                {/* Input accesible, oculto visualmente pero asociado al label */}
                <input
                    id={inputIdRef.current}
                    type='file'
                    multiple
                    accept={ACCEPT_IMAGES}
                    onChange={handleChange}
                    className={styles.visuallyHidden}
                />

                <div className={styles.toolbar}>
                    <div className={styles.uploadBtnWrapper}>
                        <PrimaryButton text='Adjuntar archivos' />
                        <input
                            type='file'
                            multiple
                            accept={ACCEPT_IMAGES}
                            onChange={handleChange}
                            className={styles.overlayInput}
                            tabIndex={-1} // evita foco “fantasma”
                            aria-hidden='true' // el foco real queda en el botón
                        />
                    </div>

                    <DefaultButton
                        text='Limpiar'
                        onClick={handleClear}
                        disabled={!archivos.length}
                    />
                </div>

                {mostrarGaleria ? (
                    <>
                        <h2 className={styles.imagesTitle}>Imágenes</h2>
                        <div className={styles.gallery}>
                            {imagenes.map((file) => renderImageCard(file))}
                        </div>
                    </>
                ) : null}
            </div>
        </Stack>
    );
};

export default AdjuntarArchivos;
