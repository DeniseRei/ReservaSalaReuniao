import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Dashboard.css';

const MainLayout = () => {
    const [menuOpen, setMenuOpen] = useState(true); // Inicia o menu como aberto

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="dashboard-container d-flex" style={{ height: '100vh' }}>
            {/* Menu lateral */}
            <div className={`sidebar ${menuOpen ? 'open' : 'closed'}`}>
                <button className="toggle-menu-btn" onClick={toggleMenu}>
                    {menuOpen ? <i className="fas fa-chevron-left"></i> : <i className="fas fa-chevron-right"></i>}
                </button>
                <h4>Menu</h4>
                <ul>
                    <li>
                        <Link to="/salas">
                            <i className="fas fa-door-open"></i> Salas
                        </Link>
                    </li>
                    <li>
                        <Link to="/reservas">
                            <i className="fas fa-calendar-check"></i> Reservas
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Conteúdo principal */}
            <div className="main-content flex-grow-1">
                <Outlet /> {/* Renderiza o conteúdo da página atual */}
            </div>

            {/* Rodapé */}
            <footer className="footer">
                <p>© 2024 Minha Aplicação de Reservas. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
