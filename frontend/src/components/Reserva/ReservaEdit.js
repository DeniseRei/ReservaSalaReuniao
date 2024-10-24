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
    const [salas, setSalas] = useState([]);
    const [mensagem, setMensagem] = useState(''); // Estado para armazenar a mensagem

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const response = await axiosConfig.get('/salas');
                setSalas(response.data);
            } catch (error) {
                console.error('Erro ao buscar salas:', error);
            }
        };

        fetchSalas();
    }, []);

    useEffect(() => {
        const fetchReserva = async () => {
            try {
                const response = await axiosConfig.get(`/reservas/${id}`);
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
                inicio: format(new Date(reserva.inicio), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
                fim: format(new Date(reserva.fim), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'),
            };
            await axiosConfig.put(`/reservas/${id}`, reservaData);
            setMensagem('Reserva atualizada com sucesso!'); // Mensagem de sucesso
            
            // Limpa a mensagem após 3 segundos e navega para reservas
            setTimeout(() => {
                setMensagem('');
                navigate('/reservas');
            }, 2000);
        } catch (error) {
            console.error('Erro ao editar reserva:', error);
            setMensagem('Não foi possível atualizar a reserva.'); // Mensagem de erro
            
            // Limpa a mensagem após 3 segundos
            setTimeout(() => {
                setMensagem('');
            }, 3000);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Editar Reserva</h2>
            {mensagem && <div className="alert alert-info">{mensagem}</div>} {/* Renderiza a mensagem se existir */}
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
                    <select
                        id="salaSelect"
                        name="sala_id"
                        className="form-control"
                        value={reserva.sala_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione uma sala</option>
                        {salas.map((sala) => (
                            <option key={sala.id} value={sala.id}>
                                {sala.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <input
                        type="datetime-local"
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
                        className="form-control"
                        placeholder="Fim"
                        value={reserva.fim}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Salvar Reserva</button>
            </form>
        </div>
    );
};

export default ReservaEdit;
