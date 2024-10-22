// src/components/ReservaList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../AxiosConfig';
import { useTable, useSortBy, usePagination } from 'react-table';

const ReservaList = () => {
    const [reservas, setReservas] = useState([]);

    const fetchReservas = async () => {
        try {
            const response = await axiosConfig.get('/reservas');
            setReservas(response.data);
        } catch (error) {
            console.error('Erro ao buscar reservas:', error);
        }
    };

    const handleCancel = async (id) => {
        try {
            await axiosConfig.delete(`/reservas/${id}`);
            fetchReservas(); // Atualiza a lista após cancelar a reserva
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
        }
    };

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
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { pageIndex, pageSize },
        page,
        canPreviousPage,
        canNextPage,
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        pageOptions,
    } = useTable(
        {
            columns,
            data: reservas,
            initialState: { pageSize: 9 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Reservas de Salas de Reunião</h2>
            <Link to="/reservas/cadastrar" className="btn btn-success mb-3">
                Cadastrar Nova Reserva
            </Link>
            <div className="card">
                <div className="card-body">
                    <table {...getTableProps()} className="table table-striped table-bordered">
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            style={{
                                                cursor: 'pointer',
                                                border: '1px solid black',
                                            }}
                                        >
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
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} style={{ border: '1px solid black' }}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} style={{ border: '1px solid black' }}>
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
                                {pageIndex + 1} de {pageOptions.length}
                            </strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservaList;
