import React, { useMemo, useRef, useState, useEffect } from 'react'
import {
    TextField,
    ITextFieldProps,
    ITextFieldStyles,
} from '@fluentui/react/lib/TextField'
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown'
import { DatePicker } from '@fluentui/react/lib/DatePicker'
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button'
import styles from './Form.module.scss'
import { Stack } from '@fluentui/react'
import { useNavigate } from 'react-router-dom'

interface FormData {
    nombre: string
    categoria?: string | number
    fecha: Date | null
}

// Constantes para persistencia
const STORAGE_KEY = 'form_datos_v1'
const PERSIST_IN: 'local' | 'session' = 'session'
const storage =
    PERSIST_IN === 'session' ? window.localStorage : window.sessionStorage
const REQUIRED_MSG = 'Esta campo es obligatorio.'

// Cargar datos guardados
function loadPersisted(): FormData | null {
    try {
        const raw = storage.getItem(STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as {
            nombre: string
            categoria?: string | number
            fecha: string | null
        }
        return {
            nombre: parsed.nombre ?? '',
            categoria: parsed.categoria,
            fecha: parsed.fecha ? new Date(parsed.fecha) : null,
        }
    } catch {
        return null
    }
}

// Guardar datos en storage
function savePersisted(data: FormData) {
    storage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            nombre: data.nombre,
            categoria: data.categoria,
            fecha: data.fecha ? data.fecha.toISOString() : null,
        })
    )
}

// Borrar datos guardados
function clearPersisted() {
    storage.removeItem(STORAGE_KEY)
}

const Form: React.FC<{ onSave?: (data: FormData) => void }> = ({ onSave }) => {
    const initial = loadPersisted() ?? {
        nombre: '',
        categoria: undefined,
        fecha: null,
    }
    const [data, setData] = useState<FormData>(initial)
    const [submitted, setSubmitted] = useState(false)
    const [rev, setRev] = useState(0) // remonta el Dropdown al limpiar
    const navigate = useNavigate()

    // Persistencia con debounce, debound es un retardo para no guardar en cada cambio
    const saveTmr = useRef<number | null>(null)
    useEffect(() => {
        if (saveTmr.current) window.clearTimeout(saveTmr.current)
        saveTmr.current = window.setTimeout(() => savePersisted(data), 250)
        return () => {
            if (saveTmr.current) window.clearTimeout(saveTmr.current)
        }
    }, [data])

    const options: IDropdownOption[] = useMemo(
        () => [
            { key: 'op1', text: 'Opción 1' },
            { key: 'op2', text: 'Opción 2' },
            { key: 'op3', text: 'Opción 3' },
        ],
        []
    )
    // Validaciones
    const errors = {
        nombre: !data.nombre.trim() ? REQUIRED_MSG : undefined,
        categoria: data.categoria === undefined ? REQUIRED_MSG : undefined,
        fecha: !data.fecha ? REQUIRED_MSG : undefined,
    }
    const isValid = !errors.nombre && !errors.categoria && !errors.fecha

    // Limpiar formulario
    const reset = () => {
        setData({ nombre: '', categoria: undefined, fecha: null })
        setSubmitted(false)
        clearPersisted()
        setRev((r) => r + 1) // limpia select re-montando
    }
    // Envío de formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        if (!isValid) return

        onSave?.(data)

        // Mostrar alerta con los datos ingresados
        const categoriaTexto =
            options.find((o) => o.key === data.categoria)?.text ??
            (data.categoria !== undefined ? String(data.categoria) : '')
        const fechaTexto = data.fecha ? data.fecha.toLocaleDateString() : ''

        alert(
            `Guardado:
            - Nombre: ${data.nombre}
            - Categoría: ${categoriaTexto}
            - Fecha: ${fechaTexto}`
        )

        // Limpiar storage y formulario tras guardar
        reset()
    }

    // Estilos del TextField interno del DatePicker cuando hay error (sin !important)
    const dateTextFieldStyles: Partial<ITextFieldStyles> | undefined =
        submitted && errors.fecha
            ? {
                  fieldGroup: {
                      borderColor: '#a4262c',
                      selectors: {
                          ':hover': { borderColor: '#a4262c' },
                          ':focus-within': { borderColor: '#a4262c' },
                      },
                  },
              }
            : undefined

    // Props para el TextField interno del DatePicker
    const dateTextFieldProps: Partial<ITextFieldProps> = {
        errorMessage: submitted ? errors.fecha : undefined,
        styles: dateTextFieldStyles,
    }

    return (
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 16 } }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <DefaultButton
                    text='← Volver'
                    onClick={() => navigate(-1)}
                    styles={{
                        root: {
                            width: 'auto', // que se ajuste al contenido
                            minWidth: 100, // tamaño mínimo
                            padding: '0 12px',
                        },
                        label: { fontSize: 14 },
                    }}
                />
            </div>

            <div className={styles.page}>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className={styles.row}>
                        <TextField
                            label='Nombre *'
                            placeholder='Ingresá un nombre'
                            value={data.nombre}
                            onChange={(_, v) =>
                                setData((s) => ({ ...s, nombre: v ?? '' }))
                            }
                            errorMessage={submitted ? errors.nombre : undefined}
                            aria-invalid={submitted && !!errors.nombre}
                        />
                    </div>

                    <div className={styles.row}>
                        <Dropdown
                            key={rev}
                            label='Categoría *'
                            placeholder='Seleccioná una categoría'
                            options={options}
                            selectedKey={data.categoria}
                            onChange={(_, opt) =>
                                setData((s) => ({ ...s, categoria: opt?.key }))
                            }
                            errorMessage={
                                submitted ? errors.categoria : undefined
                            }
                            aria-invalid={submitted && !!errors.categoria}
                        />
                    </div>

                    <div className={styles.row}>
                        <DatePicker
                            label='Fecha *'
                            placeholder='Seleccionar fecha'
                            value={data.fecha ?? undefined}
                            onSelectDate={(d) =>
                                setData((s) => ({ ...s, fecha: d ?? null }))
                            }
                            textField={dateTextFieldProps}
                        />
                    </div>

                    <div className={styles.actions}>
                        <PrimaryButton type='submit' text='Guardar' />
                        <DefaultButton
                            type='button'
                            text='Limpiar'
                            onClick={reset}
                        />
                    </div>
                </form>
            </div>
        </Stack>
    )
}

export default Form
