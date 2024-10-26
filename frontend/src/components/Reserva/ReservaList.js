import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../../AxiosConfig';
import { useTable, useSortBy, usePagination } from 'react-table';
import ReservaForm from './ReservaForm';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

const ReservaList = () => {
    const [reservas, setReservas] = useState([]);
    const [filteredReservas, setFilteredReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [responsavelFilter, setResponsavelFilter] = useState('');
    const [salaFilter, setSalaFilter] = useState(''); // Novo estado para o filtro de nome da sala

    const fetchReservas = async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get('/reservas');
            setReservas(response.data);
            setFilteredReservas(response.data);
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
            fetchReservas();
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

    // Atualizar a lógica de filtragem para incluir o filtro de nome da sala
    useEffect(() => {
        setFilteredReservas(
            reservas.filter((reserva) =>
                reserva.responsavel.toLowerCase().includes(responsavelFilter.toLowerCase()) &&
                reserva.sala.nome.toLowerCase().includes(salaFilter.toLowerCase()) // Filtrando pelo nome da sala
            )
        );
    }, [responsavelFilter, salaFilter, reservas]);

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
                <span className={getStatusClass(value)}>
                    {getStatusLabel(value)}
                </span>
            ),
        },
        {
            Header: 'Ações',
            Cell: ({ row }) => (
                <div className="d-flex flex-column flex-md-row">
                    {row.original.status !== 'concluída' && row.original.status !== 'cancelado' && (
                        <Link to={`/reservas/edit/${row.original.id}`}>
                            <button className="btn btn-primary mb-2 mb-md-0 me-md-2">Editar</button>
                        </Link>
                    )}
                    {row.original.status !== 'concluída' && row.original.status !== 'cancelado' && (
                        <button
                            className="btn btn-danger"
                            onClick={() => handleCancel(row.original.id)}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            ),
        }
    ], [handleCancel]);
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'ativo':
                return 'text-success';
            case 'concluída':
                return 'text-info';
            case 'cancelado':
                return 'text-danger';
            default:
                return '';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ativo':
                return 'Ativo';
            case 'concluída':
                return 'Concluída';
            case 'cancelado':
                return 'Cancelado';
            default:
                return 'Desconhecido';
        }
    };

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
        data: filteredReservas,
        initialState: { pageSize: 5 },
    }, useSortBy, usePagination);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Reservas</h2>
            {message && <div className="alert alert-success">{message}</div>}
            <button onClick={() => setShowForm(prev => !prev)} className="btn btn-success mb-3">
                {showForm ? 'Cancelar Cadastro' : 'Cadastrar Nova Reserva'}
            </button>
            {showForm && <ReservaForm onReservaCriada={fetchReservas} />}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Filtrar por responsável"
                    value={responsavelFilter}
                    onChange={(e) => setResponsavelFilter(e.target.value)}
                    className="form-control"
                />
            </div>
            {/* Novo campo de filtro para o nome da sala */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Filtrar por nome da sala"
                    value={salaFilter}
                    onChange={(e) => setSalaFilter(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="card mt-4">
                <div className="card-body">
                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            {/* Wrapper responsivo para a tabela */}
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

export default ReservaList;
