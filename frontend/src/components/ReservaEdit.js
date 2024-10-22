// src/components/ReservaEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../AxiosConfig';

const ReservaEdit = () => {
    const { id } = useParams(); // Obtém o ID da reserva a ser editada
    const navigate = useNavigate();
    const [reserva, setReserva] = useState({
        responsavel: '',
        sala_id: '',
        inicio: '',
        fim: '',
    });

    useEffect(() => {
        const fetchReserva = async () => {
            try {
                const response = await axiosConfig.get(`/reservas/${id}`);
                setReserva(response.data);
            } catch (error) {
                console.error('Erro ao buscar reserva:', error);
            }
        };

        fetchReserva();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReserva((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosConfig.put(`/reservas/${id}`, reserva);
            navigate('/reservas'); // Redireciona após a edição
        } catch (error) {
            console.error('Erro ao editar reserva:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="responsavel"
                placeholder="Responsável"
                value={reserva.responsavel}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="sala_id"
                placeholder="Sala ID"
                value={reserva.sala_id}
                onChange={handleChange}
                required
            />
            <input
                type="datetime-local"
                name="inicio"
                placeholder="Início"
                value={reserva.inicio}
                onChange={handleChange}
                required
            />
            <input
                type="datetime-local"
                name="fim"
                placeholder="Fim"
                value={reserva.fim}
                onChange={handleChange}
                required
            />
            <button type="submit">Salvar Reserva</button>
        </form>
    );
};

export default ReservaEdit;
