import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../../AxiosConfig';

const SalaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState({
        nome: '',
        capacidade: '',
        numero: '',
    });
    const [loading, setLoading] = useState(true); // Estado para monitorar o carregamento
    const [mensagem, setMensagem] = useState(''); // Estado para a mensagem de feedback

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
            setMensagem('Sala atualizada com sucesso!'); // Mensagem de sucesso
            
            // Limpa a mensagem após 2 segundos e navega para salas
            setTimeout(() => {
                setMensagem('');
                navigate('/salas');
            }, 2000);
        } catch (error) {
            console.error('Erro ao atualizar a sala:', error);
            if (error.response?.data?.errors?.nome) {
                setMensagem('Não foi possível atualizar a sala. Já existe uma sala com este nome.');
            } else if (error.response?.data?.errors?.numero) {
                setMensagem('Não foi possível atualizar a sala. Já existe uma sala com este número.');
            } else {
                setMensagem('Erro ao atualizar a sala.'); // Mensagem padrão para outros erros
            }
            // Limpa a mensagem após 3 segundos
            setTimeout(() => {
                setMensagem('');
            }, 3000);
        }
    };

    const handleBack = () => {
        navigate('/salas'); // Navega para a página de salas
    };

    if (loading) {
        return <div>Carregando...</div>; // Exibe "Carregando..." enquanto está buscando a sala
    }

    return (
        <div className="container mt-5">
            <div className="card mb-3">
                <div className="card-header">Editar Sala</div>
                <div className="card-body">
                    {mensagem && <div className="alert alert-info">{mensagem}</div>} {/* Mensagem de feedback */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome da Sala</label>
                            <input
                                type="text"
                                name="nome"
                                id="nome"
                                className="form-control"
                                placeholder="Nome da Sala"
                                value={sala.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="capacidade" className="form-label">Capacidade</label>
                            <input
                                type="number"
                                name="capacidade"
                                id="capacidade"
                                className="form-control"
                                placeholder="Capacidade"
                                value={sala.capacidade}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="numero" className="form-label">Número</label>
                            <input
                                type="number"
                                name="numero"
                                id="numero"
                                className="form-control"
                                placeholder="Número"
                                value={sala.numero}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Salvar Sala</button>
                        <button type="button" onClick={handleBack} className="btn btn-secondary ms-2">Voltar</button> {/* Botão Voltar */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SalaEdit;
