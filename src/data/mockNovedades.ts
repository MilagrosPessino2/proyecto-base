import type { areaSection } from '../components/utilsWord/types';

export const areaTitle = 'Diseño y comunicacion';

export const novedades: areaSection[] = [
    // 1 imagen
    {
        gerencia: 'POWER APPS',
        items: [
            {
                titulo: 'ESTA ES UNA NOVEDAD DE SA',
                resumen: 'Prueba de Novedad novedosa',
                imagenes: ['/img/prueba1.png'],
            },
        ],
    },

    // 2 imágenes
    {
        gerencia: 'POWER APPS',
        items: [
            {
                titulo: 'OTRA NOVEDAD',
                resumen: 'Elevo una Novedad para que genere en Elevadas',
                imagenes: ['/img/prueba2.png', '/img/prueba3.png'],
            },
        ],
    },

    // 3 imágenes
    {
        gerencia: 'NUEVA AREA DE PRUEBA',
        items: [
            {
                titulo: 'ELEV',
                resumen: 'aa',
                imagenes: [
                    '/img/prueba4.png',
                    '/img/prueba5.png',
                    '/img/prueba6.png',
                ],
            },
        ],
    },

    // 1 imagen
    {
        gerencia: 'NUEVA AREA DE PRUEBA',
        items: [
            {
                titulo: 'NOVEDAD 3/9',
                resumen: 'res',
                imagenes: ['/img/prueba7.png'],
            },
        ],
    },

    // 2 imágenes
    {
        gerencia: 'DISEÑO Y COMUNICACION',
        items: [
            {
                titulo: 'NOVEDADNUEVA02/09',
                resumen: 'soy un resumen resumido',
                imagenes: ['/img/prueba8.png', '/img/prueba9.png'],
            },
        ],
    },

    // 1 imagen
    {
        gerencia: 'POWER APPS',
        items: [
            {
                titulo: 'TEST',
                resumen: 'prueba',
                imagenes: ['/img/prueba10.png'],
            },
        ],
    },
];

const data = { area: areaTitle, novedad: novedades };
export default data;
