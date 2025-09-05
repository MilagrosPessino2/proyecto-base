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
import { Roles } from './utils/constants';
import AdminPage from './components/AdminPage';
import Home from './components/Home';
// import CrearWord from './components/crearWord/CrearWord';
import NovedadesPage from './pages/NovedadesPage';
// App.tsx
// import CrearWord from './components/crearWord/CrearWord';

const mockUserGroups = ['ADMINISTRADORES']; // Se puede cargar con contexto o API
const isLoading = false; // Cambia según la lógica real

const App = () => {
    return (
        <Routes>
            {/* <Route path='/' element={<Home />} /> */}
            <Route path='/' element={<NovedadesPage />} />
            {/* <Route path='/crear-word' element={<CrearWord />} /> */}
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
