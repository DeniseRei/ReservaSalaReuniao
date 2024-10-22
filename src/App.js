import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReservaList from './components/ReservaList';
import ReservaEdit from './components/ReservaEdit';
// ... outras importações

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/reservas" />} /> {/* Redireciona para /reservas */}
                <Route path="/reservas" element={<ReservaList />} />
                <Route path="/reservas/edit/:id" element={<ReservaEdit />} />
                {/* Outras rotas */}
            </Routes>
        </Router>
    );
};

export default App;
