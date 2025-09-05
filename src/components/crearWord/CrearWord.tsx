import React from 'react';
import { Packer } from 'docx';
import { createNovedadesDoc } from '../utilsWord/buildDoc';
import type { areaSection } from '../utilsWord/types';
import styles from './CrearWord.module.scss';
import rawData from '../../data/mockNovedades.json';

// Tipar el JSON para que coincida con tu código
type NovedadesData = { area: string; novedad: areaSection[] };
const data = rawData as NovedadesData;

const CrearWord: React.FC = () => {
    const handleDownload = async () => {
        const doc = createNovedadesDoc({
            areaTitle: data.area,
            novedad: data.novedad,
            maxItemsPerSection: 3,
            confidentialityLabel: 'YPF-Confidencial',
        });

        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Novedades_YPF.docx';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <button className={styles.button} onClick={handleDownload}>
            Descargar Word
        </button>
    );
};

export default CrearWord;
