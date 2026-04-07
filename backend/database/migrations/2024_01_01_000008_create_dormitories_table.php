<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dormitories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('landlord_id')->constrained('users');
            $table->foreignUuid('region_id')->nullable()->constrained();
            $table->string('name');
            $table->text('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('total_rooms')->default(0);
            $table->integer('total_beds')->default(0);
            $table->boolean('has_wifi')->default(false);
            $table->boolean('has_ac')->default(false);
            $table->boolean('has_hot_water')->default(false);
            $table->boolean('has_kitchen')->default(false);
            $table->boolean('has_parking')->default(false);
            $table->boolean('has_security')->default(false);
            $table->decimal('electricity_rate', 8, 0)->nullable();
            $table->decimal('water_rate', 8, 0)->nullable();
            $table->decimal('deposit_amount', 12, 0)->nullable();
            $table->text('rules')->nullable();
            $table->json('photos')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->string('status')->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dormitories');
    }
};
