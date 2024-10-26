import React, { useEffect, useState } from 'react';
import axiosConfig from '../../AxiosConfig';

const ReservaForm = ({ onReservaCriada }) => {
    const [salas, setSalas] = useState([]);
    const [salaId, setSalaId] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const response = await axiosConfig.get('/salas');
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
        setErrorMessage('');
    
        const now = new Date();
        if (new Date(inicio) < now || new Date(fim) < now) {
            setErrorMessage('As reservas não podem ser feitas para o passado, verifique as datas.');
            return;
        }
    
        const inicioDate = new Date(inicio);
        const fimDate = new Date(fim);
    
        if (fimDate <= inicioDate) {
            setErrorMessage('A data fim deve ser posterior à data início.');
            return;
        }
        try {
            const inicioFormatted = inicioDate.toISOString().slice(0, 19).replace('T', ' ');
            const fimFormatted = fimDate.toISOString().slice(0, 19).replace('T', ' ');
    
            const disponibilidadeResponse = await axiosConfig.post('/reservas/verificar-disponibilidade', {
                sala_id: salaId,
                inicio: inicioFormatted,
                fim: fimFormatted,
            });
    
            if (disponibilidadeResponse.data.disponivel === false) {
                setErrorMessage('A sala já está reservada nesse período.');
                return;
            }
    
            const response = await axiosConfig.post('/reservas', {
                sala_id: salaId,
                responsavel: responsavel,
                inicio: inicioFormatted,
                fim: fimFormatted,
            });
    
            onReservaCriada(response.data);
            setSuccessMessage('Reserva cadastrada com sucesso!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);

            // Limpa o formulário após a criação da reserva
            limparFormulario();
        } catch (error) {
            console.error('Erro ao cadastrar reserva:', error);
            setErrorMessage(error.response?.data?.error || 'Erro ao cadastrar reserva.');
        }
    };

    const limparFormulario = () => {
        setSalaId('');
        setResponsavel('');
        setInicio('');
        setFim('');
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div className="card mb-3">
            <div className="card-header">Cadastrar Reserva</div>
            <div className="card-body">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
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
                    <button type="submit" className="btn btn-primary me-2">Cadastrar Reserva</button>
                    <button type="button" className="btn btn-secondary" onClick={limparFormulario}>Limpar Formulário</button>
                </form>
            </div>
        </div>
    );
};

export default ReservaForm;
