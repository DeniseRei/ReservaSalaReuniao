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
            ['id' => 1, 'nome' => 'Sala A'],
            ['id' => 2, 'nome' => 'Sala B'],
            ['id' => 3, 'nome' => 'Sala C'],
            ['id' => 4, 'nome' => 'Sala D'],
            ['id' => 5, 'nome' => 'Sala E'],
        ]);
    }
}
