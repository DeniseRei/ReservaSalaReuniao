import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../../AxiosConfig';
import { format, parseISO } from 'date-fns';


const ReservaEdit = () => {
    const { id } = useParams();
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
                const formattedInicio = format(parseISO(response.data.inicio), "yyyy-MM-dd'T'HH:mm");
                const formattedFim = format(parseISO(response.data.fim), "yyyy-MM-dd'T'HH:mm");
                setReserva({
                    ...response.data,
                    inicio: formattedInicio,
                    fim: formattedFim,
                });
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
            const reservaData = {
                ...reserva,
                inicio: format(new Date(reserva.inicio), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'), // Formato de envio desejado
                fim: format(new Date(reserva.fim), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'), // Formato de envio desejado
            };
            await axiosConfig.put(`/reservas/${id}`, reservaData);
            navigate('/reservas');
        } catch (error) {
            console.error('Erro ao editar reserva:', error);
        }
    };
    

    return (
        <div className="container mt-5">
            <h2>Editar Reserva</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        name="responsavel"
                        className="form-control"
                        placeholder="Responsável"
                        value={reserva.responsavel}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        name="sala_id"
                        className="form-control"
                        placeholder="Sala ID"
                        value={reserva.sala_id}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="datetime-local"
                        name="inicio"
                        className="form-control"
                        placeholder="Início"
                        value={reserva.inicio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="datetime-local"
                        name="fim"
                        className="form-control"
                        placeholder="Fim"
                        value={reserva.fim}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Salvar Reserva</button>
            </form>
        </div>
    );
};

export default ReservaEdit;
