import React, { useRef, useState, useEffect } from 'react'
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button'
import styles from './AdjuntarArchivos.module.scss'
import { useNavigate } from 'react-router-dom'
import { Stack } from '@fluentui/react'

interface Archivo {
  id: string
  nombre: string
  esImagen: boolean
  url?: string
  fp: string
}

const AdjuntarArchivos: React.FC = () => {
  const [archivos, setArchivos] = useState<Archivo[]>([])
  const ref = useRef<HTMLInputElement>(null)
  const seq = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      archivos.forEach(a => a.url && URL.revokeObjectURL(a.url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpload = () => ref.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const nuevos: Archivo[] = []

    const existentes = new Set(archivos.map(a => a.fp))
    const agregadosAhora = new Set<string>()
    const duplicados: string[] = []

    for (const f of files) {
      const fp = `${f.name}|${f.size}|${f.lastModified}`
      if (existentes.has(fp) || agregadosAhora.has(fp)) {
        duplicados.push(f.name)
        continue
      }

      const esImagen = /image\/(jpeg|png)/i.test(f.type) || /\.(jpe?g|png)$/i.test(f.name)
      const id = `${Date.now()}-${seq.current++}`

      if (esImagen) {
        const url = URL.createObjectURL(f)
        nuevos.push({ id, nombre: f.name, esImagen: true, url, fp })
      } else {
        nuevos.push({ id, nombre: f.name, esImagen: false, fp })
      }
      agregadosAhora.add(fp)
    }

    if (duplicados.length) {
      alert(`Se ignoraron archivos duplicados: ${Array.from(new Set(duplicados)).join(', ')}`)
    }

    if (nuevos.length) setArchivos(prev => [...nuevos, ...prev])
    e.target.value = ''
  }

  const handleRemove = (id: string) => {
    setArchivos(prev => {
      const file = prev.find(a => a.id === id)
      if (file?.url) URL.revokeObjectURL(file.url)
      return prev.filter(a => a.id !== id)
    })
  }

  const handleClear = () => {
    archivos.forEach(a => a.url && URL.revokeObjectURL(a.url))
    setArchivos([])
  }

  // --- separo para render ---
  const imagenes = archivos.filter(a => a.esImagen && a.url)
  const otros = archivos.filter(a => !a.esImagen)
  const getExt = (name: string) => name.split('.').pop()?.toUpperCase() ?? 'FILE'

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 16 } }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <DefaultButton
          text='← Volver'
          onClick={() => navigate(-1)}
          styles={{
            root: { width: 'auto', minWidth: 100, padding: '0 12px' },
            label: { fontSize: 14 },
          }}
        />
      </div>

      <div className={styles.home}>
        <input ref={ref} type='file' multiple onChange={handleChange} style={{ display: 'none' }} />

        <div className={styles.toolbar}>
          <PrimaryButton text='Adjuntar archivos' onClick={handleUpload} />
          <DefaultButton text='Limpiar' onClick={handleClear} disabled={!archivos.length} />
        </div>

        {/* Galería de imágenes */}
        {imagenes.length > 0 && (
          <div className={styles.gallery}>
            {imagenes.map(file => (
              <div className={styles.imgCard} key={file.id}>
                <div className={styles.imgCardInner}>
                  <img className={styles.cardImg} src={file.url!} alt={file.nombre} />
                </div>
                <div className={styles.caption} title={file.nombre}>{file.nombre}</div>
                <button
                  type='button'
                  className={styles.removeBtn}
                  aria-label={`Eliminar ${file.nombre}`}
                  title='Eliminar'
                  onClick={() => handleRemove(file.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Lista de archivos NO imagen */}
        {otros.length > 0 && (
          <div className={styles.filesSection}>
            <div className={styles.filesHeader}>Archivos</div>
            <div className={styles.fileList}>
              {otros.map(file => (
                <div className={styles.fileItem} key={file.id} title={file.nombre}>
                  <div className={styles.fileLeft}>
                    <div className={styles.fileIcon}>{getExt(file.nombre)}</div>
                    <div className={styles.fileText}>
                      <div className={styles.fileNameText}>{file.nombre}</div>
                    </div>
                  </div>
                  <button
                        type="button"
                        className={`${styles.removeBtn} ${styles.removeBtnInline}`}
                        aria-label={`Eliminar ${file.nombre}`}
                        title="Eliminar"
                        onClick={() => handleRemove(file.id)}
                    > ×
                    </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Stack>
  )
}

export default AdjuntarArchivos
