<?php

namespace App\Http\Controllers;

use App\Models\Sala; // Certifique-se de importar o modelo Sala
use Illuminate\Http\Request;

class SalaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $salas = Sala::all();
        return response()->json($salas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $request->validate([
            'nome' => 'required|string|max:255|unique:salas,nome',
            'capacidade' => 'required|integer',
            'numero' => 'required|integer|min:1|unique:salas,numero',
        ]);

        // Cria uma nova sala
        $sala = Sala::create($request->all());

        return response()->json($sala, 201); // Retorna a sala criada com status 201
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Retorna uma sala específica
        $sala = Sala::findOrFail($id);

        if (!$sala) {
            return response()->json(['message' => 'Sala não encontrada back'], 404);
        }

        return response()->json($sala);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Busca a sala. Se não for encontrada, uma exceção será lançada.
        $sala = Sala::find($id);

        // Verifica se a sala foi encontrada
        if (!$sala) {
            return response()->json(['message' => 'Sala não encontrada'], 404);
        }

        // Validação dos dados recebidos
        $request->validate([
            'nome' => 'required|string|max:255|unique:salas,nome,' . $sala->id,
            'capacidade' => 'required|integer',
            'numero' => 'required|integer|min:1|unique:salas,numero,' . $sala->id,
        ]);

        // Atualiza os dados da sala
        $sala->nome = $request->nome;
        $sala->capacidade = $request->capacidade;
        $sala->numero = $request->numero;
        $sala->save();

        // Retorna a sala atualizada
        return response()->json($sala, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Busca a sala
        $sala = Sala::findOrFail($id);
        $sala->delete();

        return response()->json(null, 204); // Retorna status 204 No Content
    }
}
