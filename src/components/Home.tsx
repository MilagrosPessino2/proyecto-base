// src/home/Home.tsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, PrimaryButton } from '@fluentui/react';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
        >
            <Stack horizontal tokens={{ childrenGap: 24 }}>
                <PrimaryButton
                    text='Adjuntar Archivos'
                    onClick={() => navigate('/adjuntar-archivo')}
                    styles={{ root: { height: 80, width: 280, fontSize: 18 } }}
                />
                <PrimaryButton
                    text='Formulario'
                    onClick={() => navigate('/form')}
                    styles={{ root: { height: 80, width: 280, fontSize: 18 } }}
                />
            </Stack>
        </div>
    );
};

export default Home;

// import React, { useRef, useState, useEffect } from 'react';
// import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

// const Home: React.FC = () => {
//   const [imagenes, setImagenes] = useState<string[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []);
//     const validas = files.filter(
//       (f) => f.type === 'image/jpeg' || f.type === 'image/png' || /\.(jpe?g|png)$/i.test(f.name)
//     );

//     if (validas.length < files.length) {
//       alert(`Se ignoraron ${files.length - validas.length} archivo(s) que no son JPG/PNG.`);
//     }

//     const urlsNuevas = validas.map((f) => URL.createObjectURL(f));
//     setImagenes((prev) => [...prev, ...urlsNuevas]);
//     e.target.value = '';
//   };

//   const handleDelete = () => {
//     imagenes.forEach((u) => URL.revokeObjectURL(u));
//     setImagenes([]);
//   };

//   useEffect(() => {
//     return () => {
//       imagenes.forEach((u) => URL.revokeObjectURL(u));
//     };
//   }, [imagenes]);

//   return (
//     <div>
//       <h2>Subir y mostrar imágenes</h2>
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/jpeg,image/png"
//         multiple
//         style={{ display: 'none' }}
//         onChange={handleInputChange}
//       />

//       <PrimaryButton text="Adjuntar archivos" onClick={handleFileUpload} />
//       <DefaultButton text="Limpiar" onClick={handleDelete} style={{ marginLeft: 8 }} />

//       <div
//         style={{
//           marginTop: 16,
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
//           gap: 16,
//         }}
//       >
//         {imagenes.map((src, i) => (
//           <div
//             key={i}
//             style={{
//               border: '1px solid #ccc',
//               borderRadius: 8,
//               padding: 10,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: '#fafafa',
//               height: 150,
//             }}
//           >
//             <img
//               src={src}
//               alt={`img-${i}`}
//               style={{
//                 maxWidth: '100%',
//                 maxHeight: '100%',
//                 objectFit: 'contain',
//               }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;
