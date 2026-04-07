<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('dormitory_id')->constrained()->cascadeOnDelete();
            $table->string('room_number', 20);
            $table->integer('floor')->nullable();
            $table->string('room_type', 20)->default('dorm');
            $table->decimal('area_sqm', 5, 1)->nullable();
            $table->integer('capacity');
            $table->integer('current_occupancy')->default(0);
            $table->decimal('price', 12, 0);
            $table->json('amenities')->nullable();
            $table->json('photos')->nullable();
            $table->string('status')->default('available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
