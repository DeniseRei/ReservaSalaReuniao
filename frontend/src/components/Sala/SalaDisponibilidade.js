import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReservaForm from '../Reserva/ReservaForm';

const SalaDisponibilidade = () => {
    const [salas, setSalas] = useState([]);
    const [salaNome, setSalaNome] = useState('');
    const [salaId, setSalaId] = useState(null);
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [disponibilidade, setDisponibilidade] = useState(null);
    const [showForm, setShowForm] = useState(false); // Estado para controlar a visibilidade do formulário

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/salas');
                setSalas(response.data);
            } catch (error) {
                console.error("Erro ao carregar salas:", error);
            }
        };

        fetchSalas();
    }, []);

    const handleSalaChange = (e) => {
        const nomeSelecionado = e.target.value;
        setSalaNome(nomeSelecionado);

        const salaSelecionada = salas.find(sala => sala.nome === nomeSelecionado);
        setSalaId(salaSelecionada ? salaSelecionada.id : null);
    };

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString().replace('T', ' ').split('.')[0];
    };

    const verificarDisponibilidade = async () => {
        if (!salaId || !inicio || !fim) {
            alert("Por favor, selecione a sala e preencha todos os campos.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/reservas/verificar-disponibilidade', {
                sala_id: salaId,
                inicio: formatDateTime(inicio),
                fim: formatDateTime(fim)
            });
            setDisponibilidade(response.data.disponivel ? "Disponível" : "Indisponível");
        } catch (error) {
            console.error("Erro na verificação de disponibilidade:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card mb-3">
                <div className="card-header">Verificar Disponibilidade da Sala</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="sala" className="form-label">Nome da Sala</label>
                        <select id="sala" className="form-select" value={salaNome} onChange={handleSalaChange}>
                            <option value="">Selecione uma sala</option>
                            {salas.map(sala => (
                                <option key={sala.id} value={sala.nome}>{sala.nome}</option>
                            ))}
                        </select>   
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inicio" className="form-label">Início</label>
                        <input type="datetime-local" id="inicio" className="form-control" value={inicio} onChange={(e) => setInicio(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fim" className="form-label">Fim</label>
                        <input type="datetime-local" id="fim" className="form-control" value={fim} onChange={(e) => setFim(e.target.value)} />
                    </div>
                    <button onClick={verificarDisponibilidade} className="btn btn-primary">Verificar Disponibilidade</button>
                    {disponibilidade && <div className="mt-3 alert alert-info">Status: {disponibilidade}</div>}
                </div>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-success mb-3">
                {showForm ? 'Cancelar Cadastro' : 'Cadastrar Nova Reserva'}
            </button>
            {showForm && <ReservaForm onReservaCriada={() => {/* Aqui você pode fazer algo após a reserva ser criada */}} />}
        </div>
    );
};

export default SalaDisponibilidade;
