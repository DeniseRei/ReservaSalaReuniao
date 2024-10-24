import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SalaList = () => {
    const [salas, setSalas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/salas'); // Verifique se a URL está correta
                setSalas(response.data);
            } catch (error) {
                console.error("Erro ao buscar salas:", error);
                setError('Erro ao carregar salas.');
            }
        };

        fetchSalas();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/salas/${id}`); // Verifique se a URL está correta
            setSalas(salas.filter(sala => sala.id !== id));
        } catch (error) {
            console.error("Erro ao excluir sala:", error);
            setError('Erro ao excluir sala.');
        }
    };

    return (
        <div>
            <h2>Lista de Salas</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {salas.map(sala => (
                    <li key={sala.id}>
                        {sala.nome} - {sala.capacidade} - {sala.numero}
                        <Link to={`/salas/edit/${sala.id}`}>Editar</Link>
                        <button onClick={() => handleDelete(sala.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
            <Link to="/salas/cadastrar">Criar Nova Sala</Link>
        </div>
    );
};

export default SalaList;
