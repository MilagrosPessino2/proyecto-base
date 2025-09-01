import React, { useRef, useMemo, useEffect } from 'react';
import { Stack } from '@fluentui/react';
import styles from './VistaPrevia.module.scss';
import { isSupportedImage, IFileAdd } from '../../utils/constants';

interface VistaPreviaProps {
  files: IFileAdd[];
  onRemove?: (id: string) => void;
}

const ICON_DELETE = '/delete.png';

const VistaPrevia: React.FC<VistaPreviaProps> = ({ files, onRemove }) => {
  const inputIdRef = useRef(
    `file-input-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  // Generar previews solo para imágenes válidas
  const imagenes = useMemo(() => {
    return files
      .filter((f) => f.file && isSupportedImage(f.file))
      .map((f) => {
        const objectUrl = URL.createObjectURL(f.file!);
        return {
          id: f.id,
          nombre: f.file!.name,
          url: objectUrl,
        };
      });
  }, [files]);

  // Limpiar las objectURLs generadas
  useEffect(() => {
    return () => {
      imagenes.forEach((img) => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [imagenes]);

  

  const mostrarGaleria = imagenes.length > 0;

  const handleRemove = (id: string) => {
    onRemove?.(id);
  };

  const renderImageCard = (file: {
    id: string;
    nombre: string;
    url: string;
  }) => (
    <div className={styles.imgCard} key={file.id}>
      <div className={styles.imgCardInner}>
        <div className={styles.imgViewport}>
          <img className={styles.cardImg} src={file.url} alt={file.nombre} />
          {console.log("file:",file.url)}
        </div>
      </div>

      <div className={styles.caption} title={file.nombre}>
        {file.nombre}
      </div>

      <button
        type="button"
        className={styles.removeBtn}
        aria-label={`Eliminar ${file.nombre}`}
        title="Eliminar"
        onClick={() => handleRemove(file.id)}
      >
        <img
          src={ICON_DELETE}
          alt=""
          aria-hidden="true"
          className={styles.removeIcon}
        />
      </button>
    </div>
  );

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 16 } }}>
      <div className={styles.toolbarContainer}>
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

export default VistaPrevia;
