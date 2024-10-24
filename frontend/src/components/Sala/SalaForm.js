import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="container mt-5">
            <h2>Criar Sala</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome da Sala"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        value={capacidade}
                        onChange={(e) => setCapacidade(e.target.value)}
                        placeholder="Capacidade"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Número"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Criar Sala</button>
                <button type="button" onClick={clearForm} className="btn btn-secondary mt-2 ms-2">Cancelar</button> {/* Botão Cancelar */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && (
                    <div className="alert alert-success mt-3" role="alert">
                        {successMessage}
                    </div>
                )}
            </form>
        </div>
    );
};

export default SalaForm;
