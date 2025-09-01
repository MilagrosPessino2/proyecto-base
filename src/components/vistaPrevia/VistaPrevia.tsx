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


  // Crear URLs para las imágenes
  const imagenes = useMemo(() => {
    return files
      .filter((f) => f.file && isSupportedImage(f.file))
      .map((f) => ({
        id: f.id,
        nombre: f.file!.name,
        url: URL.createObjectURL(f.file!)
      }));
  }, [files]);

  // Limpiar blobs generados
  useEffect(() => {
    const urls = imagenes.map((img) => img.url);
    return () => {
      urls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagenes]);

  const mostrarGaleria = imagenes.length > 0;

//   const handleRemove = (id: string) => {
//     onRemove?.(id);
//   };

  const renderImageCard = (file: {
    id: string;
    nombre: string;
    url: string;
  }) => (
    <div className={styles.imgCard} key={file.id}>
      <div className={styles.imgCardInner}>
        <div className={styles.imgViewport}>
          <img className={styles.cardImg} src={file.url} alt={file.nombre} />
        </div>
      </div>
      <div className={styles.caption} title={file.nombre}>
        {file.nombre}
      </div>
      {/* <button
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
      </button> */}
    </div>
  );

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 16 } }}>
      <div className={styles.toolbarContainer}>
        {mostrarGaleria && (
          <>
            <div className={styles.gallery}>
              {imagenes.map((file) => renderImageCard(file))}
            </div>
          </>
        )}
      </div>
    </Stack>
  );
};

export default VistaPrevia;
 