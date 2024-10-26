<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SalaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('salas')->insert([
            ['id' => 1, 'nome' => 'Sala A', 'capacidade' => 20, 'numero' => 101],
            ['id' => 2, 'nome' => 'Sala B', 'capacidade' => 15, 'numero' => 102],
            ['id' => 3, 'nome' => 'Sala C', 'capacidade' => 10, 'numero' => 103],
            ['id' => 4, 'nome' => 'Sala D', 'capacidade' => 30, 'numero' => 104],
            ['id' => 5, 'nome' => 'Sala E', 'capacidade' => 25, 'numero' => 105],
        ]);
    }
}
