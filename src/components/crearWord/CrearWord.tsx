import React from 'react';
import { useNovedadesDownload } from './useNovedadesDownload';
import styles from './CrearWord.module.scss';
import { DOCX_FILENAME } from '../config/constants';

const CrearWord: React.FC = () => {
    const { handleDownload, loading } = useNovedadesDownload({
        filename: DOCX_FILENAME,
        // inputOverride: { sectorGeneral: '...', novedad: [...], confidentialityLabel: '...' }, // opcional
    });

    return (
        <button
            className={styles.button}
            onClick={handleDownload}
            disabled={loading}
        >
            {loading ? 'Generando...' : 'Descargar Word'}
        </button>
    );
};

export default CrearWord;
