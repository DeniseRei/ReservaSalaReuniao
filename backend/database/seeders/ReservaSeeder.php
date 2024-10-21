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
            DB::table('reservas')->insert([
                'sala_id' => $faker->numberBetween(1, 5), // Supondo que você tenha salas com IDs de 1 a 5
                'responsavel' => $faker->name,
                'inicio' => $faker->dateTimeBetween('now', '+1 week'),
                'fim' => $faker->dateTimeBetween('+1 week', '+2 weeks'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
