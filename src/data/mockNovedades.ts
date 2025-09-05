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
                resumen:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem. Nulla feugiat scelerisque quam, mattis euismod purus eleifend eget. Suspendisse ut felis ex. Maecenas ut laoreet eros. Morbi risus enim, scelerisque et quam quis, lacinia fringilla risus.',
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
                resumen:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem. Nulla feugiat scelerisque quam, mattis euismod purus eleifend eget. Suspendisse ut felis ex. Maecenas ut laoreet eros. Morbi risus enim, scelerisque et quam quis, lacinia fringilla risus. Sed volutpat leo a nibh fringilla convallis. Pellentesque eleifend nibh magna, non vulputate sapien porttitor quis. Vestibulum ac volutpat est, non commodo libero. Nulla tempus dignissim ipsum, et pellentesque sem rutrum sed. In non efficitur diam. Nulla facilisi.Suspendisse rhoncus mattis libero, id dictum felis interdum quis. Praesent ac sem eu ex scelerisque aliquet in eget turpis. Etiam rhoncus augue et odio luctus facilisis. Quisque lobortis ultrices odio eu condimentum. Nam interdum eget metus auctor venenatis. Proin eget pellentesque justo, sed tristique nisi. Proin consequat metus ut lectus condimentum blandit. Nunc non tempor libero. Mauris at magna arcu. Mauris tellus quam orci aliquam.',
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
                resumen:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem. Nulla feugiat scelerisque quam, mattis euismod purus eleifend eget. Suspendisse ut felis ex. Maecenas ut laoreet eros. Morbi risus enim, scelerisque et quam quis, lacinia fringilla risus. Sed volutpat leo a nibh fringilla convallis. Pellentesque eleifend nibh magna, non vulputate sapien porttitor quis. ',
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
                resumen: '',
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
                resumen:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem. Nulla feugiat scelerisque quam, mattis euismod purus eleifend eget. Suspendisse ut felis ex. Maecenas ut laoreet eros. Morbi risus enim, scelerisque et quam quis, lacinia fringilla risus. Sed volutpat leo a nibh fringilla convallis. Pellentesque eleifend nibh magna, non vulputate sapien porttitor quis. Vestibulum ac volutpat est, non commodo libero. Nulla tempus dignissim ipsum, et pellentesque sem rutrum sed. In non efficitur diam. Nulla facilisi.Suspendisse rhoncus mattis libero, id dictum felis interdum quis. Praesent ac sem eu ex scelerisque aliquet in eget turpis. Etiam rhoncus augue et odio luctus facilisis. Quisque lobortis ultrices odio eu condimentum. Nam interdum eget metus auctor venenatis.',
                imagenes: ['/img/prueba10.png'],
            },
        ],
    },
];

const data = { area: areaTitle, novedad: novedades };
export default data;
