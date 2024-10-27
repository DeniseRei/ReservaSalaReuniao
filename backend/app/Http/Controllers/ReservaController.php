<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ReservaController extends Controller
{
    public function index()
    {
        // Obtenha a data e hora atual
        $agora = Carbon::now();

        // Busque todas as reservas com suas salas associadas
        $reservas = Reserva::with('sala')->get();

        $reservas->transform(function ($reserva) use ($agora) {
            // Verifica se a data de início é igual a hoje e a hora é anterior à hora atual
            if (Carbon::parse($reserva->inicio)->isBefore($agora)) {
                $reserva->status = 'concluída';
            }
            return $reserva;
        });

        return response()->json($reservas);

    }

    public function store(Request $request)
    {
        $request->validate([
            'sala_id' => 'required|exists:salas,id',
            'responsavel' => 'required|string|max:255',
            'inicio' => 'required|date',
            'fim' => 'required|date|after:inicio',
            'status' => 'ativo'
        ]);

        // Convertendo as datas para o formato do banco de dados (se necessário)
        $inicio = Carbon::parse($request->inicio)->format('Y-m-d H:i:s');
        $fim = Carbon::parse($request->fim)->format('Y-m-d H:i:s');

        // Verifica se a sala está disponível
        $disponibilidadeResponse = $this->verificarDisponibilidade($request);
        $disponibilidade = json_decode($disponibilidadeResponse->getContent(), true);

        if (isset($disponibilidade['disponivel']) && !$disponibilidade['disponivel']) {
            return response()->json(['error' => 'A sala já está reservada nesse período.'], 409);
        }

        // Cria a reserva
        $reserva = Reserva::create([
            'sala_id' => $request->sala_id,
            'responsavel' => $request->responsavel,
            'inicio' => $inicio,
            'fim' => $fim,
        ]);

        return response()->json($reserva, 201);
    }

    public function show(Reserva $reserva)
    {
        return response()->json($reserva);
    }

    public function update(Request $request, Reserva $reserva)
    {
        // Validação dos dados de entrada
        $request->validate([
            'sala_id' => 'required|exists:salas,id',
            'responsavel' => 'required|string|max:255',
            'inicio' => 'required|date',
            'fim' => 'required|date|after:inicio',
        ]);

        // Convertendo as datas para o formato do banco de dados (se necessário)
        $inicioNovo = Carbon::parse($request->inicio)->format('Y-m-d H:i:s');
        $fimNovo = Carbon::parse($request->fim)->format('Y-m-d H:i:s');

        // Adiciona a reserva atual como não disponível para a verificação
        $disponibilidadeRequest = new Request([
            'sala_id' => $request->sala_id,
            'inicio' => $inicioNovo,
            'fim' => $fimNovo,
            'id' => $reserva->id // Passa o ID da reserva para ignorá-la
        ]);

        // Verifica a disponibilidade
        $disponibilidadeResponse = $this->verificarDisponibilidade($disponibilidadeRequest);
        $disponibilidade = json_decode($disponibilidadeResponse->getContent(), true);

        // Verifica se a sala está disponível
        if (isset($disponibilidade['disponivel']) && !$disponibilidade['disponivel']) {
            return response()->json(['error' => 'A sala já está reservada nesse período.'], 409);
        }

        // Atualiza a reserva
        $reserva->update($request->only(['sala_id', 'responsavel', 'inicio', 'fim']));
        return response()->json($reserva);
    }



    public function destroy(Reserva $reserva)
    {
        // Verifica se a reserva existe
        if (!$reserva) {
            return response()->json(['error' => 'Reserva não encontrada'], 404);
        }

        return $this->cancelar($reserva);
    }

    private function calcularDisponibilidade($reservas, $inicio, $fim)
    {
        foreach ($reservas as $reserva) {
            // Verifica se a reserva atual conflita com o novo período
            if ($reserva->inicio < $fim && $reserva->fim > $inicio) {
                return 'Reservado';
            }
        }
        return 'Disponível';
    }

    public function verificarDisponibilidade(Request $request)
    {
        try {
            // Validação dos dados de entrada
            $request->validate([
                'sala_id' => 'required|exists:salas,id',
                'inicio' => 'required|date_format:Y-m-d H:i:s',
                'fim' => 'required|date_format:Y-m-d H:i:s|after:inicio',
                'id' => 'nullable|exists:reservas,id' // Adicionando a validação para o ID
            ]);

            // Convertendo as datas para o formato do banco de dados
            $inicio = Carbon::parse($request->inicio)->format('Y-m-d H:i:s');
            $fim = Carbon::parse($request->fim)->format('Y-m-d H:i:s');

            // Buscando reservas existentes com status "ativo" ou status diferente de "cancelado"
            $reservasExistentes = Reserva::where('sala_id', $request->sala_id)
                ->where(function ($query) {
                    $query->where('status', 'ativo')
                        ->orWhere('status', '!=', 'cancelado');
                })
                ->where(function ($query) use ($inicio, $fim) {
                    $query->whereBetween('inicio', [$inicio, $fim])
                        ->orWhereBetween('fim', [$inicio, $fim])
                        ->orWhere(function ($query) use ($inicio, $fim) {
                            $query->where('inicio', '<=', $inicio)
                                ->where('fim', '>=', $fim);
                        });
                })
                ->where('id', '!=', $request->id) // Ignorar a reserva que está sendo editada
                ->get(); // Obter as reservas para calcular a disponibilidade

            $status = $this->calcularDisponibilidade($reservasExistentes, $inicio, $fim);

            return response()->json(['disponivel' => $status === 'Disponível']);
        } catch (\Exception $e) {
            Log::error("Erro na verificação de disponibilidade: " . $e->getMessage(), [
                'input' => $request->all(),
            ]);
            return response()->json(['error' => 'Erro ao verificar disponibilidade.'], 500);
        }
    }

    public function cancelar(Reserva $reserva)
    {
        // Verifica se a reserva existe
        if (!$reserva) {
            return response()->json(['error' => 'Reserva não encontrada'], 404);
        }

        try {
            // Atualiza o status da reserva para 'cancelado'
            $reserva->update(['status' => 'cancelado']);

            return response()->json(['message' => 'Reserva cancelada com sucesso', 'reserva' => $reserva]);
        } catch (\Exception $e) {
            Log::error("Erro ao cancelar reserva: " . $e->getMessage());
            return response()->json(['error' => 'Erro ao cancelar reserva'], 500);
        }
    }

}
