import type { SeccionAreaRich } from '../components/utilsWord/types';

export const sectorGeneral = 'Diseño y comunicacion';

// Cada item ahora es SOLO { richHtml: string } e incluye el título dentro del HTML (ej: <h1>...).
export const novedadesRich: SeccionAreaRich[] = [
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                richHtml: `<h1>ESTA ES UNA NOVEDAD DE SA</h1>
<p>Texto enriquecido</p>
<p><strong>Negrita</strong> y <em>cursiva</em> con <u>subrayado</u>.</p>
<ul>
  <li><strong>Punto</strong> con <em>formato</em></li>
  <li>Segundo punto</li>
</ul>
<ol>
  <li>Ítem 1 numerado</li>
  <li>Ítem 2 numerado</li>
</ol>
<p><img src="/img/prueba1.png" /></p>
<p>Texto de cierre.</p>`,
            },
        ],
    },
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                richHtml: `<h1>OTRA NOVEDAD</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<p><img src="/img/prueba2.png" /></p>
<p><img src="/img/prueba3.png" /></p>`,
            },
        ],
    },
    {
        areaNovedad: 'NUEVA AREA DE PRUEBA',
        items: [
            {
                richHtml: `<h1>ELEV</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem.</p>
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
                richHtml: `<h1>NOVEDAD 3/9</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut faucibus est, sodales pharetra sem.</p>
<p><img src="/img/prueba7.png" /></p>`,
            },
        ],
    },
    {
        areaNovedad: 'DISEÑO Y COMUNICACION',
        items: [
            {
                richHtml: `<h1>NOVEDADNUEVA02/09</h1>
<p>(sin texto)</p>
<p><img src="/img/prueba8.png" /></p>
<p><img src="/img/prueba9.png" /></p>`,
            },
        ],
    },
    {
        areaNovedad: 'POWER APPS',
        items: [
            {
                richHtml: `<h1>TEST</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<ul>
  <li>Bullet uno</li>
  <li>Bullet dos con <strong>negrita</strong></li>
</ul>
<p><img src="/img/prueba10.png" /></p>`,
            },
        ],
    },
];

const data = { area: sectorGeneral, novedad: novedadesRich };
export default data;
