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
        Schema::table('workers', function (Blueprint $table) {
            $table->string('zalo', 50)->nullable()->after('email');
            $table->string('facebook_url', 500)->nullable()->after('zalo');
            $table->string('id_issued_date', 20)->nullable()->after('id_number');
            $table->string('id_issued_place', 255)->nullable()->after('id_issued_date');
        });
    }

    public function down(): void
    {
        Schema::table('workers', function (Blueprint $table) {
            $table->dropColumn(['zalo', 'facebook_url', 'id_issued_date', 'id_issued_place']);
        });
    }
};
