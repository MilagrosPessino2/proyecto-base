import React, { useRef, useState, useEffect } from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import styles from './AdjuntarArchivos.module.scss';

interface Archivo {
  nombre: string;
  src?: string; 
  esImagen: boolean;
}

const Form: React.FC = () => {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const ref = useRef<HTMLInputElement>(null);

 
  useEffect(() => {
    const saved = localStorage.getItem('archivosGuardados');
    if (saved) setArchivos(JSON.parse(saved));
  }, []);


  useEffect(() => {
    localStorage.setItem('archivosGuardados', JSON.stringify(archivos));
  }, [archivos]);

  const handleUpload = () => ref.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(f => {
      const esImagen = /image\/(jpeg|png)/i.test(f.type) || /\.(jpe?g|png)$/i.test(f.name);

      if (esImagen) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const src = reader.result as string;
          setArchivos(prev => [...prev, { nombre: f.name, src, esImagen: true }]);
        };
        reader.readAsDataURL(f);
      } else {
        setArchivos(prev => [...prev, { nombre: f.name, esImagen: false }]);
      }
    });
    e.target.value = '';
  };

  const handleClear = () => {
    setArchivos([]);
    localStorage.removeItem('archivosGuardados');
  };

  return (
    <div className={styles.home}>
      <input
        ref={ref}
        type="file"
        multiple
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      <div className={styles.toolbar}>
        <PrimaryButton text="Adjuntar archivos" onClick={handleUpload} />
        <DefaultButton text="Limpiar" onClick={handleClear} disabled={!archivos.length} />
      </div>

      <div className={styles.gallery}>
        {archivos.map((file, i) => (
          <div className={styles.imgCard} key={i}>
            <div className={styles.imgCardInner}>
              {file.esImagen ? (
                <img className={styles.cardImg} src={file.src} alt={file.nombre} />
              ) : (
                <span>{file.nombre}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form;
