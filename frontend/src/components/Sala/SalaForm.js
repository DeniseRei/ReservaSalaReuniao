import axios from 'axios';
import React, { useState } from 'react';

const SalaForm = () => {
    const [nome, setNome] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [numero, setNumero] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            setSuccess("Sala criada com sucesso!");
            console.log("Sala criada com sucesso:", response.data);
            // Redirecione ou limpe os campos se necessário
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
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da Sala"
                required
            />
            <input
                type="number"
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                placeholder="Capacidade"
                required
            />
            <input
                type="number"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Número"
                required
            />
            <button type="submit">Criar Sala</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
    );
};

export default SalaForm;
