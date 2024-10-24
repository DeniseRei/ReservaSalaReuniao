import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate para redirecionamento

const SalaForm = () => {
    const [nome, setNome] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [numero, setNumero] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Hook para redirecionamento

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Criando um objeto com os dados da sala
        const salaData = {
            nome,
            capacidade,
            numero,
        };

        try {
            // Ajuste a URL aqui para o seu backend
            const response = await axios.post('http://localhost:8000/api/salas', salaData);
            setSuccessMessage("Sala criada com sucesso!");
            console.log("Sala criada com sucesso:", response.data);
            // Redireciona ou limpa os campos se necessário
            setTimeout(() => {
                setSuccessMessage('');
                navigate('/salas'); // Redireciona para a lista de salas após a criação
            }, 3000);
            // Limpa os campos
            setNome('');
            setCapacidade('');
            setNumero('');
        } catch (error) {
            // Verifique se o erro tem a estrutura esperada
            const errorMessage = error.response?.data?.message || "Erro ao criar sala.";
            setError(errorMessage);
            console.error("Erro ao criar sala:", error);
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
