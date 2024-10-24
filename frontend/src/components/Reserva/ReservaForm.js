import React, { useState } from 'react';
import axiosConfig from '../../AxiosConfig'; 
import { useNavigate } from 'react-router-dom'; 

const ReservaForm = ({ onReservaCriada }) => {
    const [responsavel, setResponsavel] = useState('');
    const [salaId, setSalaId] = useState('');
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axiosConfig.post('/reservas', {
                sala_id: salaId,
                responsavel,
                inicio,
                fim,
            });

            onReservaCriada(response.data); // Adiciona a nova reserva à lista
            setSuccessMessage('Reserva efetuada com Sucesso!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            navigate('/reservas'); 
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Erro de validação:', error.response.data.errors);
            } else {
                console.error('Erro ao criar reserva:', error);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Reservar Sala de Reunião</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Responsável"
                        value={responsavel}
                        onChange={(e) => setResponsavel(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Sala ID"
                        value={salaId}
                        onChange={(e) => setSalaId(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="datetime-local"
                        className="form-control"
                        placeholder="Início"
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="datetime-local"
                        className="form-control"
                        placeholder="Fim"
                        value={fim}
                        onChange={(e) => setFim(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Criar Reserva</button>
                {successMessage && (
                    <div className="alert alert-success mt-3" role="alert">
                        {successMessage}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ReservaForm;
