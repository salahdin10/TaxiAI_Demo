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
        Schema::create('taxis', function (Blueprint $table) {
            $table->id();
            $table->string('model');
            $table->string('mark');
            $table->string('license_plate')->unique();
            $table->foreignId('zone_id')
                ->constrained()  // Links to zones table
                ->onDelete('cascade'); // Delete taxis when zone is deleted
            $table->timestamps();

            // Optional indexes for better performance
            $table->index('zone_id');
            $table->index('license_plate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxis');
    }
};
