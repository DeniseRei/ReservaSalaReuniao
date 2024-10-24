import React, { useEffect, useState } from 'react';
import axiosConfig from '../../AxiosConfig';

const ReservaForm = ({ onReservaCriada }) => {
    const [salas, setSalas] = useState([]);
    const [salaId, setSalaId] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Estado para a mensagem de sucesso

    // Função para buscar salas disponíveis
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
    
        const now = new Date();
    
        // Verifica se a data de início ou fim é no passado
        if (new Date(inicio) < now || new Date(fim) < now) {
            setErrorMessage('As reservas não podem ser feitas para o passado, verifique as datas.');
            return;
        }
    
        try {
            // Formata a data para o padrão ISO 8601
            const inicioFormatted = new Date(inicio).toISOString().slice(0, 19); // Formato 'YYYY-MM-DDTHH:MM:SS'
            const fimFormatted = new Date(fim).toISOString().slice(0, 19);
    
            const response = await axiosConfig.post('/reservas', {
                sala_id: salaId,
                responsavel: responsavel,
                inicio: inicioFormatted,
                fim: fimFormatted,
            });
    
            // Lógica para lidar com a reserva criada
            onReservaCriada(response.data); 
    
            // Exibe a mensagem de sucesso
            setSuccessMessage('Reserva cadastrada com sucesso!');
            
            // Remove a mensagem de sucesso após 2 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 2000); // 2 segundos
    
            // Limpa o formulário após a criação da reserva
            setSalaId('');
            setResponsavel('');
            setInicio('');
            setFim('');
        } catch (error) {
            console.error('Erro ao cadastrar reserva:', error);
            setErrorMessage(error.response?.data?.error || 'Erro ao cadastrar reserva. Tente novamente.');
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-header">Cadastrar Reserva</div>
            <div className="card-body">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Mensagem de sucesso */}
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
