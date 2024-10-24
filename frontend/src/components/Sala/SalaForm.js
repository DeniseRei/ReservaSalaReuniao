import axios from 'axios';
import React, { useState } from 'react';

const SalaForm = ({ onSalaCreated }) => {
    const [nome, setNome] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [numero, setNumero] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Função para limpar o formulário
    const clearForm = () => {
        setNome('');
        setCapacidade('');
        setNumero('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!nome || capacidade <= 0 || numero <= 0) {
            setError("Por favor, preencha todos os campos corretamente.");
            return;
        }
    
        const salaData = {
            nome,
            capacidade,
            numero,
        };
    
        try {
            await axios.post('http://localhost:8000/api/salas', salaData);
            setSuccessMessage("Sala criada com sucesso!");
            clearForm(); // Limpa o formulário após a criação
            
            // Chama a função de atualização da lista de salas
            onSalaCreated();

            // Limpa a mensagem de sucesso após 2 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || "Erro ao criar sala.");
        }
        
    };

    return (
        <div className="card mb-3">
            <div className="card-header">Criar Sala</div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nome" className="form-label">Nome da Sala</label>
                        <input
                            type="text"
                            id="nome"
                            className="form-control"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Nome da Sala"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="capacidade" className="form-label">Capacidade</label>
                        <input
                            type="number"
                            id="capacidade"
                            className="form-control"
                            value={capacidade}
                            onChange={(e) => setCapacidade(e.target.value)}
                            placeholder="Capacidade"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="numero" className="form-label">Número</label>
                        <input
                            type="number"
                            id="numero"
                            className="form-control"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            placeholder="Número"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Criar Sala</button>
                    <button type="button" onClick={clearForm} className="btn btn-secondary ms-2">Limpar Formulário</button>
                </form>
            </div>
        </div>
    );
};

export default SalaForm;
