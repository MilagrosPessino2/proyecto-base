import React from 'react';
import { Packer } from 'docx';
import { createNovedadesDoc } from '../utilsWord/buildDoc';
import type { areaSection } from '../utilsWord/types';
import styles from './CrearWord.module.scss';
import data, { areaTitle, novedades } from '../../data/mockNovedades';

const CrearWord: React.FC = () => {
    const handleDownload = async () => {
        // función asíncrona para manejar la descarga
        const doc = await createNovedadesDoc({
            areaTitle: data.area,
            novedad: data.novedad,
            maxItemsPerSection: 3,
            confidentialityLabel: 'YPF-Confidencial',
        });

        //CAMBIAR PARA DESCARGARLO AUTOMATICAMENTE
        //CREAR COMPONENTE PARA BOTON DE DESCARGA
        // empaquetar y descargar
        const blob = await Packer.toBlob(doc); // esperar a que se empaquete
        const url = window.URL.createObjectURL(blob); // crear un objeto URL para el blob
        const a = document.createElement('a'); // crear un elemento <a>
        a.href = url; // asignar el href al objeto URL
        a.download = 'Novedades_YPF.docx'; // nombre del archivo
        a.click(); // simular el clic para iniciar la descarga
        window.URL.revokeObjectURL(url); // limpiar el objeto URL
    };

    return (
        <button className={styles.button} onClick={handleDownload}>
            Descargar Word
        </button>
    );
};

export default CrearWord;
