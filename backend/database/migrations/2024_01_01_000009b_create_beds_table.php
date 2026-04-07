<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('beds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('room_id')->constrained()->cascadeOnDelete();
            $table->string('bed_number', 20);
            $table->string('bed_position', 20)->default('single'); // upper, lower, single
            $table->decimal('price', 12, 0);
            $table->string('status')->default('available'); // available, occupied, maintenance
            $table->foreignUuid('current_occupant_id')->nullable()->constrained('worker_profiles');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('beds');
    }
};
