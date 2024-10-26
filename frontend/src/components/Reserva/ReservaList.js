import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../../AxiosConfig';
import { useTable, useSortBy, usePagination } from 'react-table';
import ReservaForm from './ReservaForm';
import { format } from 'date-fns'; 
import pt from 'date-fns/locale/pt-BR'; 

const ReservaList = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false); 
    const [message, setMessage] = useState('');

    const fetchReservas = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get('/reservas');
                        setReservas(response.data);
        } catch (error) {
            console.error('Erro ao buscar reservas:', error);
            setMessage('Erro ao buscar reservas.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = useCallback(async (id) => {
        const confirmCancel = window.confirm("Você tem certeza que deseja cancelar a reserva?");
        if (!confirmCancel) return;

        try {
            await axiosConfig.delete(`/reservas/${id}`);
            setMessage('Reserva excluída com sucesso!');
            fetchReservas(); // Atualiza a lista de reservas
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            setMessage('Erro ao cancelar reserva.');
        }
    }, []);

    useEffect(() => {
        fetchReservas();
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const columns = React.useMemo(() => [
        { Header: 'Sala ID', accessor: 'sala_id' },
        { Header: 'Nome da Sala', accessor: 'sala.nome' },
        { Header: 'Responsável', accessor: 'responsavel' },
        { 
            Header: 'Início',
            accessor: 'inicio',
            Cell: ({ cell: { value } }) => format(new Date(value), 'Pp', { locale: pt }),
        },
        { 
            Header: 'Fim',
            accessor: 'fim',
            Cell: ({ cell: { value } }) => format(new Date(value), 'Pp', { locale: pt }),
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ cell: { value } }) => (
                <span className={value === 'ativo' ? 'text-success' : value === 'concluída' ? 'text-info' : 'text-danger'}>
                    {value === 'ativo' ? 'Ativo' : value === 'concluída' ? 'Concluída' : 'Cancelado'}
                </span>
            ),
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
    ], [handleCancel]);    

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
        data: reservas,
        initialState: { pageSize: 5 },
    }, useSortBy, usePagination);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Reservas</h2>
            {message && <div className="alert alert-success">{message}</div>}
            <button onClick={() => setShowForm(!showForm)} className="btn btn-success mb-3">
                {showForm ? 'Cancelar Cadastro' : 'Cadastrar Nova Reserva'}
            </button>
            {showForm && <ReservaForm onReservaCriada={fetchReservas} />}
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

export default ReservaList;
