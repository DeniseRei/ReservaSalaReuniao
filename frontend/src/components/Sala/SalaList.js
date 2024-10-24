import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../../AxiosConfig';
import { useTable, useSortBy, usePagination } from 'react-table';
import SalaForm from './SalaForm'; // Importando o componente de formulário

const SalaList = () => {
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false); // Estado para controlar a exibição do formulário

    const fetchSalas = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get('/salas'); // URL da API para buscar salas
            setSalas(response.data);
        } catch (error) {
            console.error("Erro ao buscar salas:", error);
            setError('Erro ao carregar salas.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = useCallback(async (id) => {
        try {
            await axiosConfig.delete(`/salas/${id}`); // URL da API para deletar sala
            setSalas(salas.filter(sala => sala.id !== id));
        } catch (error) {
            console.error("Erro ao excluir sala:", error);
            setError('Erro ao excluir sala.');
        }
    }, [salas]);

    useEffect(() => {
        fetchSalas();
    }, []);

    const columns = React.useMemo(() => [
        {
            Header: 'Nome',
            accessor: 'nome', // A chave que contém o nome da sala
        },
        {
            Header: 'Capacidade',
            accessor: 'capacidade', // A chave que contém a capacidade da sala
        },
        {
            Header: 'Número',
            accessor: 'numero', // A chave que contém o número da sala
        },
        {
            Header: 'Ações',
            Cell: ({ row }) => (
                <div>
                    <Link to={`/salas/edit/${row.original.id}`}>
                        <button className="btn btn-primary">Editar</button>
                    </Link>
                    <button
                        className="btn btn-danger ms-2"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        Excluir
                    </button>
                </div>
            ),
        },
    ], [handleDelete]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        gotoPage,
        previousPage,
        nextPage,
        pageOptions,
    } = useTable({
        columns,
        data: salas,
        initialState: { pageSize: 5 },
    }, useSortBy, usePagination);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Salas</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-success mb-3">
                {showForm ? 'Cancelar Cadastro' : 'Cadastrar Nova Sala'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {showForm && <SalaForm />} {/* Condicional para renderizar o formulário */}
            <div className="card mt-4">
                <div className="card-body">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            <table {...getTableProps()} className="table table-striped table-bordered">
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                                                    {column.render('Header')}
                                                    <span>
                                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {page.map(row => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} key={row.original.id}>
                                                {row.cells.map(cell => (
                                                    <td {...cell.getCellProps()} key={cell.column.id}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="btn btn-secondary me-1">{'<<'}</button>
                                    <button onClick={() => previousPage()} disabled={!canPreviousPage} className="btn btn-secondary me-1">{'<'}</button>
                                    <button onClick={() => nextPage()} disabled={!canNextPage} className="btn btn-secondary me-1">{'>'}</button>
                                    <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage} className="btn btn-secondary">{'>>'}</button>
                                </div>
                                <span>
                                    Página <strong>{page.length} de {pageOptions.length}</strong>
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalaList;
