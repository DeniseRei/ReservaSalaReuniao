import axios from 'axios';
import React, { useState, useEffect } from 'react';

const SalaDisponibilidade = () => {
    const [salas, setSalas] = useState([]);
    const [salaNome, setSalaNome] = useState('');
    const [salaId, setSalaId] = useState(null);
    const [inicio, setInicio] = useState('');
    const [fim, setFim] = useState('');
    const [disponibilidade, setDisponibilidade] = useState(null);

    useEffect(() => {
        // Carregar todas as salas ao montar o componente
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

        // Encontrar o ID da sala selecionada pelo nome
        const salaSelecionada = salas.find(sala => sala.nome === nomeSelecionado);
        setSalaId(salaSelecionada ? salaSelecionada.id : null);
    };

    // Função para formatar data e hora no padrão Y-m-d H:i:s
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
                inicio: formatDateTime(inicio),  // Aplicando a formatação
                fim: formatDateTime(fim)         // Aplicando a formatação
            });
            setDisponibilidade(response.data.disponivel ? "Disponível" : "Indisponível");
        } catch (error) {
            console.error("Erro na verificação de disponibilidade:", error);
        }
    };

    return (
        <div>
            <h3>Verificar Disponibilidade de Sala</h3>
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
    );
};

export default SalaDisponibilidade;
