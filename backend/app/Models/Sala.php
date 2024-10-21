<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    use HasFactory;

    protected $fillable = ['nome']; // Campos que podem ser preenchidos em massa

    public function reservas()
    {
        return $this->hasMany(Reserva::class); // Uma sala pode ter muitas reservas
    }
}
