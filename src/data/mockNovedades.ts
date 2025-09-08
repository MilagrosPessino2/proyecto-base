import type { SeccionArea } from '../components/utilsWord/types';

export const sectorGeneral = 'Diseño y comunicacion';

export const novedades: SeccionArea[] = [
    // 1 imagen
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                tituloNovedad: 'ESTA ES UNA NOVEDAD DE SA',
                detalleNovedad: 'Prueba de Novedad novedosa',
                imagenesNovedad: ['/img/prueba1.png'],
            },
        ],
    },

    // 2 imágenes
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                tituloNovedad: 'OTRA NOVEDAD',
                detalleNovedad:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem. Nulla feugiat scelerisque quam, mattis euismod purus eleifend eget. Suspendisse ut felis ex. Maecenas ut laoreet eros. Morbi risus enim, scelerisque et quam quis, lacinia fringilla risus.',
                imagenesNovedad: ['/img/prueba2.png', '/img/prueba3.png'],
            },
        ],
    },

    // 3 imágenes
    {
        areaNovedad: 'NUEVA AREA DE PRUEBA',
        items: [
            {
                tituloNovedad: 'ELEV',
                detalleNovedad:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem. Nulla feugiat scelerisque quam, mattis euismod purus eleifend eget. Suspendisse ut felis ex. Maecenas ut laoreet eros. Morbi risus enim, scelerisque et quam quis, lacinia fringilla risus. Sed volutpat leo a nibh fringilla convallis. Pellentesque eleifend nibh magna, non vulputate sapien porttitor quis. Vestibulum ac volutpat est, non commodo libero. Nulla tempus dignissim ipsum, et pellentesque sem rutrum sed. In non efficitur diam. Nulla facilisi.Suspendisse rhoncus mattis libero, id dictum felis interdum quis. Praesent ac sem eu ex scelerisque aliquet in eget turpis. Etiam rhoncus augue et odio luctus facilisis. Quisque lobortis ultrices odio eu condimentum. Nam interdum eget metus auctor venenatis. Proin eget pellentesque justo, sed tristique nisi. Proin consequat metus ut lectus condimentum blandit. Nunc non tempor libero. Mauris at magna arcu. Mauris tellus quam orci aliquam.',
                imagenesNovedad: [
                    '/img/prueba4.png',
                    '/img/prueba5.png',
                    '/img/prueba6.png',
                ],
            },
        ],
    },

    // 1 imagen
    {
        areaNovedad: 'NUEVA AREA DE PRUEBA',
        items: [
            {
                tituloNovedad: 'NOVEDAD 3/9',
                detalleNovedad:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem. Nulla feugiat scelerisque quam, mattis euismod purus eleifend eget. Suspendisse ut felis ex. Maecenas ut laoreet eros. Morbi risus enim, scelerisque et quam quis, lacinia fringilla risus. Sed volutpat leo a nibh fringilla convallis. Pellentesque eleifend nibh magna, non vulputate sapien porttitor quis. ',
                imagenesNovedad: ['/img/prueba7.png'],
            },
        ],
    },

    // 2 imágenes
    {
        areaNovedad: 'DISEÑO Y COMUNICACION',
        items: [
            {
                tituloNovedad: 'NOVEDADNUEVA02/09',
                detalleNovedad: '',
                imagenesNovedad: ['/img/prueba8.png', '/img/prueba9.png'],
            },
        ],
    },

    // 1 imagen
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                tituloNovedad: 'TEST',
                detalleNovedad:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem. Nulla feugiat scelerisque quam, mattis euismod purus eleifend eget. Suspendisse ut felis ex. Maecenas ut laoreet eros. Morbi risus enim, scelerisque et quam quis, lacinia fringilla risus. Sed volutpat leo a nibh fringilla convallis. Pellentesque eleifend nibh magna, non vulputate sapien porttitor quis. Vestibulum ac volutpat est, non commodo libero. Nulla tempus dignissim ipsum, et pellentesque sem rutrum sed. In non efficitur diam. Nulla facilisi.Suspendisse rhoncus mattis libero, id dictum felis interdum quis. Praesent ac sem eu ex scelerisque aliquet in eget turpis. Etiam rhoncus augue et odio luctus facilisis. Quisque lobortis ultrices odio eu condimentum. Nam interdum eget metus auctor venenatis.',
                imagenesNovedad: ['/img/prueba10.png'],
            },
        ],
    },
];

const data = { area: sectorGeneral, novedad: novedades };
export default data;
