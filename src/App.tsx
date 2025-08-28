// BORRAR este App y descomentar código de abajo si se quiere aprovechar el ejemplo con React Router DOM
// const App = () => {
//   return (
//     <>
//     </>
//   );
// };

// export default App;

import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { Roles } from './utils/constants'
import AdminPage from './components/AdminPage'
import ADJ from './components/adjuntarArchivos/AdjuntarArchivos'
import FormPage from './components/form/Form'

const mockUserGroups = ['ADMINISTRADORES'] // Se puede cargar con contexto o API
const isLoading = false // Cambia según la lógica real

const App = () => {
    return (
        <Routes>
            {/* <Route path='/' element={<ADJ />} /> */}
            <Route path='/' element={<FormPage />} />
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
    )
}

export default App
