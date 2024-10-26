<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            // Adiciona a coluna status com valor padrão 'ativo'
            $table->enum('status', ['ativo', 'cancelado', 'concluída'])->default('ativo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            // Remove a coluna status
            $table->dropColumn('status');
        });
    }
};
