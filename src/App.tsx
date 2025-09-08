import { Routes, Route } from 'react-router-dom';
// import CrearWord from './components/crearWord/CrearWord
import NovedadesPage from './pages/NovedadesPage';

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<NovedadesPage />} />
            {/* <Route path='/crear-word' element={<CrearWord />} /> */}
        </Routes>
    );
};

export default App;
