import React, { useEffect, useState } from 'react';
import axiosConfig from '../../AxiosConfig';

const ReservaForm = ({ onReservaCriada }) => {
    const [salas, setSalas] = useState([]);
    const [salaId, setSalaId] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const response = await axiosConfig.get('/salas'); // Ajuste a URL conforme sua API
                setSalas(response.data);
            } catch (error) {
                console.error('Erro ao buscar salas:', error);
            }
        };
        
        fetchSalas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosConfig.post('/reservas', {
                sala_id: salaId,
                responsavel,
                inicio,
                fim,
            });
            onReservaCriada(); // Chama a função para atualizar a lista de reservas
            // Limpa os campos após o envio
            setSalaId('');
            setResponsavel('');
            setInicio('');
            setFim('');
        } catch (error) {
            console.error('Erro ao cadastrar reserva:', error);
        }
    };

    return (
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
    );
};

export default ReservaForm;
