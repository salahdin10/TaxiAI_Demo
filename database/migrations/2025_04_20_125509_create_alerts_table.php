<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->string('type');           // 'unknown_person' or 'wrong_taxi'
            $table->text('description');      // human‑friendly message
            $table->timestamp('detected_at'); // when detection occurred

            // optional foreign keys for context
            $table->foreignId('driver_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();
            $table->foreignId('taxi_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
