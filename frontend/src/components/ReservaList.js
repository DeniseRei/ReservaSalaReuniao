import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../AxiosConfig';
import { useTable, useSortBy, usePagination } from 'react-table';

const ReservaList = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carregamento

    const fetchReservas = async () => {
        setLoading(true); // Inicia o carregamento
        try {
            const response = await axiosConfig.get('/reservas');
            const reservasData = response.data;

            // Verificando IDs duplicados
            const idSet = new Set();
            const duplicatedIds = [];

            reservasData.forEach((reserva) => {
                if (idSet.has(reserva.id)) {
                    duplicatedIds.push(reserva.id); // Adiciona ID duplicado à lista
                } else {
                    idSet.add(reserva.id); // Adiciona ID ao Set
                }
            });

            if (duplicatedIds.length > 0) {
                console.warn('IDs duplicados encontrados:', duplicatedIds);
            }

            setReservas(reservasData);
        } catch (error) {
            console.error('Erro ao buscar reservas:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    const handleCancel = useCallback(async (id) => {
        try {
            await axiosConfig.delete(`/reservas/${id}`);
            fetchReservas(); // Atualiza a lista após cancelar a reserva
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error.response ? error.response.data : error.message);
        }
    }, []);

    useEffect(() => {
        fetchReservas();
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Sala ID',
                accessor: 'sala_id',
            },
            {
                Header: 'Responsável',
                accessor: 'responsavel',
            },
            {
                Header: 'Início',
                accessor: 'inicio',
            },
            {
                Header: 'Fim',
                accessor: 'fim',
            },
            {
                Header: 'Ações',
                Cell: ({ row }) => (
                    <div>
                        <Link to={`/reservas/edit/${row.original.id}`}>
                            <button className="btn btn-primary">Editar</button>
                        </Link>
                        <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleCancel(row.original.id)}
                        >
                            Cancelar
                        </button>
                    </div>
                ),
            },
        ],
        [handleCancel]
    );

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
        {
            columns,
            data: reservas,
            initialState: { pageSize: 5 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Reservas</h2>
            <Link to="/reservas/cadastrar" className="btn btn-success mb-3">
                Cadastrar Nova Reserva
            </Link>
            <div className="card">
                <div className="card-body">
                    {loading ? (
                        <p>Carregando...</p> // Mensagem de carregamento
                    ) : (
                        <>
                            <table {...getTableProps()} className="table table-striped table-bordered">
                                <thead>
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                            {headerGroup.headers.map((column) => (
                                                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id} style={{ cursor: 'pointer', border: '1px solid black' }}>
                                                    {column.render('Header')}
                                                    <span>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? ' 🔽'
                                                                : ' 🔼'
                                                            : ''}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {page.map((row) => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} key={row.original.id}>
                                                {row.cells.map((cell) => {
                                                    return (
                                                        <td {...cell.getCellProps()} key={cell.column.id} style={{ border: '1px solid black' }}>
                                                            {cell.render('Cell')}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <button
                                        onClick={() => gotoPage(0)}
                                        disabled={!canPreviousPage}
                                        className="btn btn-secondary me-1"
                                    >
                                        {'<<'}
                                    </button>
                                    <button
                                        onClick={() => previousPage()}
                                        disabled={!canPreviousPage}
                                        className="btn btn-secondary me-1"
                                    >
                                        {'<'}
                                    </button>
                                    <button
                                        onClick={() => nextPage()}
                                        disabled={!canNextPage}
                                        className="btn btn-secondary me-1"
                                    >
                                        {'>'}
                                    </button>
                                    <button
                                        onClick={() => gotoPage(pageOptions.length - 1)}
                                        disabled={!canNextPage}
                                        className="btn btn-secondary"
                                    >
                                        {'>>'}
                                    </button>
                                </div>
                                <span>
                                    Página{' '}
                                    <strong>
                                        {page.length} de {pageOptions.length}
                                    </strong>
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservaList;
