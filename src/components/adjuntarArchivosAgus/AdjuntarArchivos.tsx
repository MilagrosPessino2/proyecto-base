import React, { useEffect, useRef, useState } from 'react'
import { Stack, PrimaryButton, DefaultButton, IconButton } from '@fluentui/react'
import estilos from './AdjuntarArchivos.module.scss'
import { Imagenes } from '../../utils/constants'

interface Archivo {
  id: string
  nombre: string
  esImagen: boolean
  url?: string
  identificadorArchivo: string
  extension?: typeof Imagenes[keyof typeof Imagenes]
}


const generarIdentificadorArchivo = (archivo: File): string =>
  `${archivo.name}|${archivo.size}|${archivo.lastModified}`

type ExtensionImagen = typeof Imagenes[keyof typeof Imagenes]

const obtenerExtensionDeImagen = (archivo: File): ExtensionImagen | null => {
  const extensionEnNombre = archivo.name.split('.').pop()?.toUpperCase() ?? ''
  switch (extensionEnNombre) {
    case Imagenes.JPG:
    case Imagenes.JPEG:
    case Imagenes.PNG:
    case Imagenes.GIF:
    case Imagenes.SVG:
      return extensionEnNombre as ExtensionImagen
    default: {
      const tipo = archivo.type.toLowerCase()
      if (tipo.includes('jpeg') || tipo.includes('jpg')) return Imagenes.JPEG
      if (tipo.includes('png')) return Imagenes.PNG
      if (tipo.includes('gif')) return Imagenes.GIF
      if (tipo.includes('svg')) return Imagenes.SVG
      return null
    }
  }
}


const AdjuntarArchivos: React.FC = () => {
  const [archivos, establecerArchivos] = useState<Archivo[]>([])
  const referenciaEntrada = useRef<HTMLInputElement>(null)
  const secuencia = useRef(0)

  useEffect(() => {
    
    return () => {
      archivos.forEach(a => a.url && URL.revokeObjectURL(a.url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const abrirSelector = () => referenciaEntrada.current?.click()

  const cambiarArchivos = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const seleccionados = Array.from(evento.target.files ?? [])
    if (seleccionados.length === 0) {
      evento.target.value = ''
      return
    }

    const huellasExistentes = new Set(archivos.map(a => a.identificadorArchivo))
    const huellasAgregadasAhora = new Set<string>()
    const nuevosArchivos: Archivo[] = []
    const nombresDuplicados: string[] = []

    for (const archivo of seleccionados) {
      const huella = generarIdentificadorArchivo(archivo)
      if (huellasExistentes.has(huella) || huellasAgregadasAhora.has(huella)) {
        nombresDuplicados.push(archivo.name)
        continue
      }

      const extension = obtenerExtensionDeImagen(archivo)
      const esImagen = !!extension
      const id = `${Date.now()}-${secuencia.current++}`

      if (esImagen) {
        const url = URL.createObjectURL(archivo)
        nuevosArchivos.push({
          id,
          nombre: archivo.name,
          esImagen: true,
          url,
          identificadorArchivo: huella,
          extension: extension!
        })
      } else {
        nuevosArchivos.push({
          id,
          nombre: archivo.name,
          esImagen: false,
          identificadorArchivo: huella
        })
      }

      huellasAgregadasAhora.add(huella)
    }

    if (nombresDuplicados.length) {
      alert(`Se ignoraron archivos duplicados: ${Array.from(new Set(nombresDuplicados)).join(', ')}`)
    }

    if (nuevosArchivos.length) {
      establecerArchivos(previos => [...nuevosArchivos, ...previos])
    }

    // Permite volver a elegir el mismo archivo
    evento.target.value = ''
  }

  const eliminarUno = (id: string) => {
    establecerArchivos(previos => {
      const encontrado = previos.find(a => a.id === id)
      if (encontrado?.url) URL.revokeObjectURL(encontrado.url)
      return previos.filter(a => a.id !== id)
    })
  }

  const limpiarTodo = () => {
    archivos.forEach(a => a.url && URL.revokeObjectURL(a.url))
    establecerArchivos([])
  }

  // Solo imágenes con URL para la galería
  const imagenes = archivos.filter(a => a.esImagen && a.url)

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 16 } }}>
      <div className={estilos.contenedorBarra}>
        <input
          ref={referenciaEntrada}
          type="file"
          multiple
          onChange={cambiarArchivos}
          accept=".jpg,.jpeg,.png,.gif,.svg,image/*"
          style={{ display: 'none' }}
        />

        <div className={estilos.barra}>
          <PrimaryButton text="Adjuntar archivos" onClick={abrirSelector} />
          <DefaultButton text="Limpiar" onClick={limpiarTodo} disabled={!archivos.length} />
        </div>

        {imagenes.length > 0 && (
          <div className={estilos.galeria}>
            {imagenes.map(archivo => (
              <div className={estilos.tarjetaImagen} key={archivo.id}>
                <div className={estilos.contenidoTarjeta}>
                  <img className={estilos.imagenTarjeta} src={archivo.url!} alt={archivo.nombre} />
                </div>

                <div className={estilos.epigrafe} title={archivo.nombre}>
                  {archivo.nombre}
                </div>

                {/* Botón eliminar como ícono de Fluent UI */}
                <IconButton
                  aria-label={`Eliminar ${archivo.nombre}`}
                  title="Eliminar"
                  iconProps={{ iconName: 'Delete' }}
                  onClick={() => eliminarUno(archivo.id)}
                  className={estilos.botonEliminar}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Stack>
  )
}

export default AdjuntarArchivos
