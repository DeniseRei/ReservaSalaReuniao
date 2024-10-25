import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Dashboard.css';

const MainLayout = () => {
    const [menuOpen, setMenuOpen] = useState(true); // Inicia o menu como aberto
    const [subMenuOpen, setSubMenuOpen] = useState(false); // Inicia o submenu de Salas como fechado
    const [reservasSubMenuOpen, setReservasSubMenuOpen] = useState(false); // Inicia o submenu de Reservas como fechado

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    const toggleReservasSubMenu = () => {
        setReservasSubMenuOpen(!reservasSubMenuOpen);
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
                        <div onClick={toggleSubMenu} style={{ cursor: 'pointer' }}>
                            <i className="fas fa-door-open"></i> Salas
                        </div>
                        <ul className={`submenu ${subMenuOpen ? 'active' : ''}`}>
                            <li>
                                <Link to="/salas">
                                    <i className="fas fa-list"></i> Salas Cadastradas
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div onClick={toggleReservasSubMenu} style={{ cursor: 'pointer' }}>
                            <i className="fas fa-calendar-check"></i> Reservas
                        </div>
                        <ul className={`submenu ${reservasSubMenuOpen ? 'active' : ''}`}>
                            <li>
                                <Link to="/reservas">
                                    <i className="fas fa-calendar-plus"></i> Minhas Reservas
                                </Link>
                            </li>
                            <li>
                                <Link to="/salas/disponibilidade">
                                    <i className="fas fa-check-circle"></i> Verificar Disponibilidade
                                </Link>
                            </li>
                        </ul>
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
