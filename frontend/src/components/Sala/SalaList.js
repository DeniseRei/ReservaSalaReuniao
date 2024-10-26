import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../../AxiosConfig';
import { useTable, useSortBy, usePagination } from 'react-table';
import SalaForm from './SalaForm';

const SalaList = () => {
    const [salas, setSalas] = useState([]);
    const [filteredSalas, setFilteredSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [salaNomeFilter, setSalaNomeFilter] = useState('');

    const fetchSalas = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get('/salas');
            setSalas(response.data);
            setFilteredSalas(response.data);
        } catch (error) {
            console.error("Erro ao buscar salas:", error);
            setError('Erro ao carregar salas.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = useCallback(async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta sala?")) {
            try {
                await axiosConfig.delete(`/salas/${id}`);
                setSalas(salas.filter(sala => sala.id !== id));
                setFilteredSalas(filteredSalas.filter(sala => sala.id !== id));
            } catch (error) {
                console.error("Erro ao excluir sala:", error);
                setError('Erro ao excluir sala.');
            }
        }
    }, [salas, filteredSalas]);

    const handleSalaCreated = async () => {
        await fetchSalas();
    };

    useEffect(() => {
        fetchSalas();
    }, []);

    useEffect(() => {
        setFilteredSalas(
            salas.filter(sala =>
                sala.nome.toLowerCase().includes(salaNomeFilter.toLowerCase())
            )
        );
    }, [salaNomeFilter, salas]);

    const columns = React.useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
        },
        {
            Header: 'Nome',
            accessor: 'nome',
        },
        {
            Header: 'Capacidade',
            accessor: 'capacidade',
        },
        {
            Header: 'Número',
            accessor: 'numero',
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
    } = useTable(
        { columns, data: filteredSalas, initialState: { pageSize: 5 } },
        useSortBy,
        usePagination
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Salas</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-success mb-3">
                {showForm ? 'Cancelar Cadastro' : 'Cadastrar Nova Sala'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {showForm && <SalaForm onSalaCreated={handleSalaCreated} />}

            {/* Campo de entrada para o filtro de nome da sala */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Filtrar por nome da sala"
                    value={salaNomeFilter}
                    onChange={(e) => setSalaNomeFilter(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="card mt-4">
                <div className="card-body">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            <div className="table-responsive">
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
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="btn btn-secondary me-1">{'<<'}</button>
                                    <button onClick={previousPage} disabled={!canPreviousPage} className="btn btn-secondary me-1">{'<'}</button>
                                    <button onClick={nextPage} disabled={!canNextPage} className="btn btn-secondary me-1">{'>'}</button>
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
