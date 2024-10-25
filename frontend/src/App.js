import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Exemplo de importação depois da mudança
import MainLayout from './components/MainLayout';
import ReservaEdit from './components/Reserva/ReservaEdit';
import ReservaForm from './components/Reserva/ReservaForm';
import ReservaList from './components/Reserva/ReservaList';
import SalaEdit from './components/Sala/SalaEdit';
import SalaForm from './components/Sala/SalaForm';
import SalaList from './components/Sala/SalaList';
import SalaDisponibilidade from './components/Sala/SalaDisponibilidade';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/reservas" />} /> {/* Redireciona para /reservas */}
                    <Route path="/reservas" element={<ReservaList />} />
                    <Route path="/reservas/cadastrar" element={<ReservaForm />} />
                    <Route path="/reservas/edit/:id" element={<ReservaEdit />} />
                    
                    {/* Rotas para as Salas */}
                    <Route path="/salas" element={<SalaList />} />
                    <Route path="/salas/cadastrar" element={<SalaForm />} />
                    <Route path="/salas/edit/:id" element={<SalaEdit />} />
                    <Route path="/salas/disponibilidade" element={<SalaDisponibilidade />} />
                    
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
