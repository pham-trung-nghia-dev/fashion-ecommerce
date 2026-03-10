<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('sub_title')->nullable()->after('name');
            $table->decimal('old_price', 12, 2)->nullable()->after('price');
            $table->unsignedTinyInteger('discount')->nullable()->after('old_price');
            $table->boolean('is_new')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['sub_title', 'old_price', 'discount', 'is_new']);
        });
    }
};
