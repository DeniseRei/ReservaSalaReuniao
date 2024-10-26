<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\ReservaController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('salas', SalaController::class);
Route::apiResource('reservas', ReservaController::class);
// Rota para verificar a disponibilidade da sala
Route::post('/reservas/verificar-disponibilidade', [ReservaController::class, 'verificarDisponibilidade']);
// Rota para cancelar uma reserva
Route::patch('/reservas/{reserva}/cancelar', [ReservaController::class, 'cancelar']);






