import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Exemplo de importação depois da mudança
import ReservaEdit from './components/Reserva/ReservaEdit';
import ReservaForm from './components/Reserva/ReservaForm';
import ReservaList from './components/Reserva/ReservaList';

import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/reservas" />} /> {/* Redireciona para /reservas */}
                <Route path="/reservas" element={<ReservaList />} />
                <Route path="/reservas/cadastrar" element={<ReservaForm />} /> {/* Nova rota para cadastro */}
                <Route path="/reservas/edit/:id" element={<ReservaEdit />} />
                {/* Outras rotas */}
            </Routes>
        </Router>
    );
};

export default App;
