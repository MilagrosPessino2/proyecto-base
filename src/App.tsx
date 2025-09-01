// BORRAR este App y descomentar código de abajo si se quiere aprovechar el ejemplo con React Router DOM
// const App = () => {
//   return (
//     <>
//     </>
//   );
// };

// export default App;

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { IFileAdd, Roles } from './utils/constants';
import AdminPage from './components/AdminPage';

import Form from './components/form/Form';
import Home from './components/Home';
import AdjuntarArchivos from './components/adjuntarArchivos/AdjuntarArchivos';
import { useEffect, useState } from 'react';
import VistaPrevia from './components/vistaPrevia/VistaPrevia';

const mockUserGroups = ['ADMINISTRADORES']; // Se puede cargar con contexto o API
const isLoading = false; // Cambia según la lógica real

const App = () => {
    const [files, setFiles] = useState<IFileAdd[]>([]);

    useEffect(() => {
        console.log('Archivos seleccionados:', files);
    }, [files]);
    return (
        <Routes>
            {/* <Route path='/' element={<ADJ />} /> */}
            <Route path='/' element={<Home />} />
            <Route path='/adjuntar-archivo' element={
                <>
                    <AdjuntarArchivos
                        setFiles={setFiles}
                    />
                    <VistaPrevia
                        files={files}
                    />
                </>

            } />
            <Route path='/form' element={<Form />} />
            <Route
                path='/admin'
                element={
                    <ProtectedRoute
                        requiredRole={Roles.OTRO}
                        userGroups={mockUserGroups}
                        isLoading={isLoading}
                    >
                        <AdminPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default App;
