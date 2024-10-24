import React, { useEffect, useState } from 'react';
import axiosConfig from '../../AxiosConfig';

const ReservaForm = ({ onReservaCriada }) => {
    const [salas, setSalas] = useState([]);
    const [salaId, setSalaId] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const response = await axiosConfig.get('/salas'); // Ajuste a URL conforme sua API
                setSalas(response.data);
            } catch (error) {
                console.error('Erro ao buscar salas:', error);
                setErrorMessage('Erro ao carregar salas. Tente novamente mais tarde.');
            }
        };
        
        fetchSalas();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(''); // Limpa a mensagem de erro antes de tentar enviar

        try {
            const response = await axiosConfig.post('/reservas', {
                sala_id: salaId,
                responsavel: responsavel,
                inicio: inicio,
                fim: fim,
            });

            // Lógica para lidar com a reserva criada, como chamar a função de callback
            onReservaCriada(response.data); // Exemplo

            // Limpa o formulário após a criação da reserva
            setSalaId('');
            setResponsavel('');
            setInicio('');
            setFim('');
        } catch (error) {
            console.error('Erro ao cadastrar reserva:', error);
            // Exibe a mensagem de erro retornada pela API
            setErrorMessage(error.response?.data?.error || 'Erro ao cadastrar reserva. Tente novamente.');
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-header">Cadastrar Reserva</div>
            <div className="card-body">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="salaId" className="form-label">Selecione a Sala</label>
                        <select
                            id="salaId"
                            value={salaId}
                            onChange={(e) => setSalaId(e.target.value)}
                            required
                            className="form-select"
                        >
                            <option value="">Selecione uma sala</option>
                            {salas.map(sala => (
                                <option key={sala.id} value={sala.id}>{sala.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="responsavel" className="form-label">Responsável</label>
                        <input
                            type="text"
                            id="responsavel"
                            value={responsavel}
                            onChange={(e) => setResponsavel(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inicio" className="form-label">Início</label>
                        <input
                            type="datetime-local"
                            id="inicio"
                            value={inicio}
                            onChange={(e) => setInicio(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fim" className="form-label">Fim</label>
                        <input
                            type="datetime-local"
                            id="fim"
                            value={fim}
                            onChange={(e) => setFim(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Cadastrar Reserva</button>
                </form>
            </div>
        </div>
    );
};

export default ReservaForm;
