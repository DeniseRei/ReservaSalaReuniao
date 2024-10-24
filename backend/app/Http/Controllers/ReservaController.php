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
        $reservas = Reserva::with('sala')->get();
        return response()->json($reservas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sala_id' => 'required|exists:salas,id',
            'responsavel' => 'required|string|max:255',
            'inicio' => 'required|date',
            'fim' => 'required|date|after:inicio',
        ]);

        // Convertendo as datas para o formato do banco de dados (se necessário)
        $inicio = Carbon::parse($request->inicio)->format('Y-m-d H:i:s');
        $fim = Carbon::parse($request->fim)->format('Y-m-d H:i:s');

        // Verifica se a sala está disponível
        $disponibilidade = $this->verificarDisponibilidade($request->sala_id, $inicio, $fim);

        if (!$disponibilidade['disponivel']) {
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
        $request->validate([
            'sala_id' => 'exists:salas,id',
            'responsavel' => 'string|max:255',
            'inicio' => 'date',
            'fim' => 'date|after:inicio',
        ]);

        $reserva->update($request->all());
        return response()->json($reserva);
    }

    public function destroy(Reserva $reserva)
    {
        if (!$reserva) {
            return response()->json(['error' => 'Reserva não encontrada'], 404);
        }

        try {
            Log::info("Cancelando reserva com ID: " . $reserva->id);
            $reserva->delete();
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error("Erro ao cancelar reserva: " . $e->getMessage());
            return response()->json(['error' => 'Erro ao cancelar reserva'], 500);
        }
    }

    public function verificarDisponibilidade($salaId, $inicio, $fim)
    {
        $reservasExistentes = Reserva::where('sala_id', $salaId)
            ->where(function ($query) use ($inicio, $fim) {
                $query->whereBetween('inicio', [$inicio, $fim])
                    ->orWhereBetween('fim', [$inicio, $fim])
                    ->orWhere(function ($query) use ($inicio, $fim) {
                        $query->where('inicio', '<=', $inicio)
                            ->where('fim', '>=', $fim);
                    });
            })
            ->exists();

        return ['disponivel' => !$reservasExistentes];
    }
}
