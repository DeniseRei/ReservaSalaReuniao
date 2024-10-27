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
        setMensagem(''); // Limpa mensagens anteriores
    
        const now = new Date();
        const inicioDate = new Date(reserva.inicio);
        const fimDate = new Date(reserva.fim);
    
        // Verificação para datas no passado
        if (inicioDate < now || fimDate < now) {
            setMensagem('As reservas não podem ser feitas para o passado, verifique as datas.');
            return;
        }
    
        // Verificação se a data fim é posterior à data início
        if (fimDate <= inicioDate) {
            setMensagem('A data fim deve ser posterior à data início.');
            return;
        }
    
        // Verificação de disponibilidade
        const inicioFormatted = format(inicioDate, 'yyyy-MM-dd HH:mm:ss');
        const fimFormatted = format(fimDate, 'yyyy-MM-dd HH:mm:ss');
    
        try {
            const disponibilidadeResponse = await axiosConfig.post('/reservas/verificar-disponibilidade', {
                sala_id: reserva.sala_id, // Certifique-se de usar o ID da sala correta
                inicio: inicioFormatted,
                fim: fimFormatted,
            });
    
            // Verifica se a sala já está reservada no período
            if (disponibilidadeResponse.data.disponivel === false) {
                setMensagem('A sala já está reservada nesse período.');
                return;
            }
    
            // Dados da reserva com as datas formatadas
            const reservaData = {
                ...reserva,
                inicio: inicioFormatted,
                fim: fimFormatted,
            };
    
            // Atualização da reserva
            await axiosConfig.put(`/reservas/${id}`, reservaData);
            setMensagem('Reserva atualizada com sucesso!'); // Mensagem de sucesso
            
            // Limpa a mensagem após 2 segundos e navega para reservas
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
        <div className="card mb-3">
            <div className="card-header">Editar Reserva</div>
            <div className="card-body">
                {mensagem && <div className="alert alert-info">{mensagem}</div>} {/* Renderiza a mensagem se existir */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="responsavel" className="form-label">Responsável</label>
                        <input
                            type="text"
                            name="responsavel"
                            className="form-control"
                            placeholder="Digite o responsável"
                            value={reserva.responsavel}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="salaSelect" className="form-label">Sala</label>
                        <select
                            id="salaSelect"
                            name="sala_id"
                            className="form-select"
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
                        <label htmlFor="inicio" className="form-label">Data de Início</label>
                        <input
                            type="datetime-local"
                            name="inicio"
                            className="form-control"
                            value={reserva.inicio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fim" className="form-label">Data de Fim</label>
                        <input
                            type="datetime-local"
                            name="fim"
                            className="form-control"
                            value={reserva.fim}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Salvar Reserva</button>
                </form>
            </div>
        </div>
    );
};

export default ReservaEdit;
