<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index()
    {
        return Reserva::all();
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
        $reserva->delete();
        return response()->noContent();
    }
}
