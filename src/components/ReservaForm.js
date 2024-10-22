import React, { useState } from 'react';
import axiosConfig from '../AxiosConfig'; // Certifique-se de que o caminho está correto
import { Link } from 'react-router-dom'; // Para navegação


const ReservaForm = () => {
    const [responsavel, setResponsavel] = useState('');
    const [salaId, setSalaId] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o recarregamento da página ao enviar o formulário
        try {
            const response = await axiosConfig.post('/reservas', {
                sala_id: salaId,
                responsavel,
                inicio,
                fim,
            });
            
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Erro de validação:', error.response.data.errors);
            } else {
                console.error('Erro ao criar reserva:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Responsável"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)} // Atualiza o estado do responsável
                required
            />
            <input
                type="number"
                placeholder="Sala ID"
                value={salaId}
                onChange={(e) => setSalaId(e.target.value)} // Atualiza o estado da sala ID
                required
            />
            <input
                type="datetime-local"
                placeholder="Início"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)} // Atualiza o estado do início
                required
            />
            <input
                type="datetime-local"
                placeholder="Fim"
                value={fim}
                onChange={(e) => setFim(e.target.value)} // Atualiza o estado do fim
                required
            />
            <button type="submit">Criar Reserva</button>
        </form>
    );
};

export default ReservaForm;
