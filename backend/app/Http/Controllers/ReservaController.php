<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

        return Reserva::create($request->all());
    }

    public function show(Reserva $reserva)
    {
        return $reserva;
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
        return $reserva;
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


}
