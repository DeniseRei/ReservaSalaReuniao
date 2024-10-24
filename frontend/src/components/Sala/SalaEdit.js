import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../../AxiosConfig';

const SalaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState({
        nome: '',
        capacidade: '',
    });
    const [loading, setLoading] = useState(true); // Estado para monitorar o carregamento

    useEffect(() => {
        const fetchSala = async () => {
            try {
                const response = await axiosConfig.get(`/salas/${id}`);
                setSala(response.data);
                setLoading(false); // Quando a requisição terminar, setar loading como false
            } catch (error) {
                console.error('Erro ao buscar a sala:', error);
                setLoading(false); // Mesmo em caso de erro, parar o estado de carregamento
            }
        };

        fetchSala();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSala((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosConfig.put(`/salas/${id}`, sala);
            navigate('/salas');
        } catch (error) {
            console.error('Erro ao editar a sala:', error);
        }
    };

    if (loading) {
        return <div>Carregando...</div>; // Exibe "Carregando..." enquanto está buscando a sala
    }

    return (
        <div className="container mt-5">
            <h2>Editar Sala</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        name="nome"
                        className="form-control"
                        placeholder="Nome da Sala"
                        value={sala.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        name="capacidade"
                        className="form-control"
                        placeholder="Capacidade"
                        value={sala.capacidade}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Salvar Sala</button>
            </form>
        </div>
    );
};

export default SalaEdit;
