import React, { useRef, useState, useEffect } from 'react'
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button'
import styles from './AdjuntarArchivos.module.scss'

interface Archivo {
    nombre: string
    esImagen: boolean
    url?: string // Object URL para preview si es imagen
}

const AdjuntarArchivos: React.FC = () => {
    const [archivos, setArchivos] = useState<Archivo[]>([])
    const ref = useRef<HTMLInputElement>(null)

    // Limpia los Object URLs al desmontar
    useEffect(() => {
        return () => {
            archivos.forEach((a) => a.url && URL.revokeObjectURL(a.url))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUpload = () => ref.current?.click()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        const nuevos: Archivo[] = []

        files.forEach((f) => {
            const esImagen =
                /image\/(jpeg|png)/i.test(f.type) ||
                /\.(jpe?g|png)$/i.test(f.name)

            if (esImagen) {
                const url = URL.createObjectURL(f) // no base64, no storage
                nuevos.push({ nombre: f.name, esImagen: true, url })
            } else {
                nuevos.push({ nombre: f.name, esImagen: false })
            }
        })

        setArchivos((prev) => [...prev, ...nuevos])

        // Permite volver a seleccionar los mismos archivos
        e.target.value = ''
    }

    const handleClear = () => {
        // Revoca todas las URLs para liberar memoria
        archivos.forEach((a) => a.url && URL.revokeObjectURL(a.url))
        setArchivos([])
    }

    return (
        <div className={styles.home}>
            <input
                ref={ref}
                type='file'
                multiple
                onChange={handleChange}
                style={{ display: 'none' }}
            />

            <div className={styles.toolbar}>
                <PrimaryButton
                    text='Adjuntar archivos'
                    onClick={handleUpload}
                />
                <DefaultButton
                    text='Limpiar'
                    onClick={handleClear}
                    disabled={!archivos.length}
                />
            </div>

            <div className={styles.gallery}>
                {archivos.map((file, i) => (
                    <div className={styles.imgCard} key={`${file.nombre}-${i}`}>
                        <div className={styles.imgCardInner}>
                            {file.esImagen && file.url ? (
                                <img
                                    className={styles.cardImg}
                                    src={file.url}
                                    alt={file.nombre}
                                />
                            ) : (
                                <span>{file.nombre}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdjuntarArchivos
