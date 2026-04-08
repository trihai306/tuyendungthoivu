<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payrolls_v2', function (Blueprint $table) {
            $table->uuid('reviewed_by')->nullable()->after('status');
            $table->timestampTz('reviewed_at')->nullable()->after('reviewed_by');

            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('payrolls_v2', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['reviewed_by', 'reviewed_at']);
        });
    }
};
