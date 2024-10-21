<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
        'sala_id',
        'responsavel',
        'inicio',
        'fim',
    ]; // Campos que podem ser preenchidos em massa

    public function sala()
    {
        return $this->belongsTo(Sala::class); // Uma reserva pertence a uma sala
    }
}
