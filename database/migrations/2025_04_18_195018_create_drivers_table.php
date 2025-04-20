<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('permis_confidence')->unique();
            $table->string('cin')->unique();
            $table->string('license_number')->unique();
            $table->string('phone')->unique();
            $table->string('email')->unique();
            $table->foreignId('taxi_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->index(['taxi_id', 'cin', 'phone']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('drivers');
    }
};
