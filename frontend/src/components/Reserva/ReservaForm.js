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
    
        const inicioDate = new Date(inicio);
        const fimDate = new Date(fim);
    
        // Verifica se a data de fim é posterior à data de início
        if (fimDate <= inicioDate) {
            setErrorMessage('A data fim deve ser posterior à data início.');
            return;
        }
        try {
            // Formata a data para o padrão 'Y-m-d H:i:s'
            const inicioFormatted = inicioDate.toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'
            const fimFormatted = fimDate.toISOString().slice(0, 19).replace('T', ' ');
    
            // Verifica disponibilidade antes de criar a reserva
            const disponibilidadeResponse = await axiosConfig.post('/reservas/verificar-disponibilidade', {
                sala_id: salaId,
                inicio: inicioFormatted,
                fim: fimFormatted,
            });
    
            // Verifica se a resposta contém a propriedade 'disponivel'
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
            // Aqui garantimos que a mensagem de erro seja retornada corretamente
            setErrorMessage(error.response?.data?.error || 'Erro ao cadastrar reserva.');
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
