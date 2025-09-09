import type { SeccionAreaRich } from '../components/utilsWord/types';

export const sectorGeneral = 'Diseño y comunicacion';

/** El detalle ahora viene en HTML completo (p, strong, ul/ol, img base64 o URL). */
export const novedadesRich: SeccionAreaRich[] = [
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                tituloNovedad: 'ESTA ES UNA NOVEDAD DE SA',
                detalleHtml: `<p>Texto enriquecido</p>
<p><strong>Negrita</strong></p>
<ul><li><strong>Punto</strong></li></ul>
<ol><li><strong>Punto</strong></li></ol>
<p><img src="/img/prueba1.png" /></p>
<p>dadsasdsadf</p>`,
            },
        ],
    },
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                tituloNovedad: 'OTRA NOVEDAD',
                detalleHtml: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<p><img src="/img/prueba2.png" /></p>
<p><img src="/img/prueba3.png" /></p>`,
            },
        ],
    },
    {
        areaNovedad: 'NUEVA AREA DE PRUEBA',
        items: [
            {
                tituloNovedad: 'ELEV',
                detalleHtml: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem.</p>
<p><img src="/img/prueba4.png" /></p>
<p><img src="/img/prueba5.png" /></p>
<p><img src="/img/prueba6.png" /></p>`,
            },
        ],
    },
    {
        areaNovedad: 'NUEVA AREA DE PRUEBA',
        items: [
            {
                tituloNovedad: 'NOVEDAD 3/9',
                detalleHtml: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem.</p>
<p><img src="/img/prueba7.png" /></p>`,
            },
        ],
    },
    {
        areaNovedad: 'DISEÑO Y COMUNICACION',
        items: [
            {
                tituloNovedad: 'NOVEDADNUEVA02/09',
                detalleHtml: `<p>(sin texto)</p>
<p><img src="/img/prueba8.png" /></p>
<p><img src="/img/prueba9.png" /></p>`,
            },
        ],
    },
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                tituloNovedad: 'TEST',
                detalleHtml: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<p><img src="/img/prueba10.png" /></p>`,
            },
        ],
    },
];

const data = { area: sectorGeneral, novedad: novedadesRich };
export default data;
