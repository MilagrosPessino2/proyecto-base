import React from 'react';
import { Packer } from 'docx';
import { createNovedadesDoc } from '../utilsWord/buildDoc';
import type { AreaSection } from '../utilsWord/types';
import styles from './CrearWord.module.scss';

const mockData: { sector: string; sections: AreaSection[] } = {
    sector: 'Diseño y comunicación',
    sections: [
        {
            title: 'MANTENIMIENTO',
            items: [
                {
                    title: 'ESTA ES UNA NOVEDAD DE SA',
                    desc: 'Prueba de Novedad novedosa',
                },
                {
                    title: 'OTRA NOVEDAD',
                    desc: 'Elevo una Novedad para que genere en Elevadas',
                },
                { title: 'TEST', desc: 'prueba' },
                { title: 'EXTRA (no debería verse)', desc: 'supera el máximo' },
            ],
        },
        {
            title: 'NUEVA AREA DE PRUEBA',
            items: [
                { title: 'ELEV', desc: 'aa' },
                { title: 'NOVEDAD 3/9', desc: 'res' },
            ],
        },
        {
            title: 'DISEÑO Y COMUNICACION',
            items: [
                { title: 'NOVEDADNUEVA02/09', desc: 'soy un resumen resumido' },
            ],
        },
    ],
};

const CrearWord: React.FC = () => {
    const handleDownload = async () => {
        // Acá podrías recibir props o estado en lugar de usar mockData.
        const doc = createNovedadesDoc({
            sectorTitle: mockData.sector,
            sections: mockData.sections,
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
