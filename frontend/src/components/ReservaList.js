// src/components/ReservaList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importe Link para usar a navegação
import axiosConfig from '../AxiosConfig'; // Caminho para o axiosConfig

const ReservaList = () => {
    <Link to="/reservas/cadastrar">Cadastrar Nova Reserva</Link>
    const [reservas, setReservas] = useState([]);

    const fetchReservas = async () => {
        try {
            const response = await axiosConfig.get('/reservas');
            setReservas(response.data);
        } catch (error) {
            console.error('Erro ao buscar reservas:', error);
        }
    };

    const handleCancel = async (id) => {
        try {
            await axiosConfig.delete(`/reservas/${id}`);
            fetchReservas(); // Atualiza a lista após cancelar a reserva
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    return (
        <div>
            <h2>Lista de Reservas</h2>
            <ul>
                {reservas.map((reserva) => (
                    <li key={reserva.id}>
                        {reserva.responsavel} - {reserva.inicio} a {reserva.fim}
                        <button onClick={() => handleCancel(reserva.id)}>Cancelar</button>
                        <Link to={`/reservas/edit/${reserva.id}`}>
                            <button>Editar</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReservaList;
