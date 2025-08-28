import React, { useRef, useState, useEffect } from 'react'
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button'
import styles from './Form.module.scss'

const Form: React.FC = () => {
    const [imagenes, setImagenes] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const saved = localStorage.getItem('imagenesGuardadas')
        if (saved) setImagenes(JSON.parse(saved))
    }, [])
    useEffect(() => {
        localStorage.setItem('imagenesGuardadas', JSON.stringify(imagenes))
    }, [imagenes])

    const handleFileUpload = () => fileInputRef.current?.click()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        const validas = files.filter(
            (f) =>
                f.type === 'image/jpeg' ||
                f.type === 'image/png' ||
                /\.(jpe?g|png)$/i.test(f.name)
        )
        if (validas.length < files.length) {
            alert(
                `Se ignoraron ${
                    files.length - validas.length
                } archivo(s) que no son JPG/PNG.`
            )
        }
        validas.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () =>
                setImagenes((prev) => [...prev, reader.result as string])
            reader.readAsDataURL(file)
        })
        e.target.value = ''
    }

    const handleDelete = () => {
        setImagenes([])
        localStorage.removeItem('imagenesGuardadas')
    }

    return (
        <div className={styles.home}>
            <input
                ref={fileInputRef}
                type='file'
                accept='image/jpeg,image/png'
                multiple
                onChange={handleInputChange}
                style={{ display: 'none' }}
            />

            <div className={styles.toolbar}>
                <PrimaryButton
                    text='Adjuntar archivos'
                    onClick={handleFileUpload}
                />
                <DefaultButton
                    text='Limpiar'
                    onClick={handleDelete}
                    disabled={!imagenes.length}
                />
            </div>

            <div className={styles.gallery}>
                {imagenes.map((src, i) => (
                    <div className={styles.card} key={i}>
                        <img
                            className={styles.cardImg}
                            src={src}
                            alt={`img-${i}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Form
