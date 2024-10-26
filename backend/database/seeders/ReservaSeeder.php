<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ReservaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 10) as $index) {
            // Gera a data de início
            $inicio = $faker->dateTimeBetween('now', '+1 week');
            // Gera a data de fim como 1 a 2 horas após a data de início
            $fim = (clone $inicio)->modify('+1 hour');

            DB::table('reservas')->insert([
                'sala_id' => $faker->numberBetween(1, 5), // IDs das salas variam de 1 a 5
                'responsavel' => $faker->name,
                'inicio' => $inicio,
                'fim' => $fim,
                'status' => $faker->randomElement(['ativo', 'cancelado', 'concluída']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
