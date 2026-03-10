<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('primary_category_id')
                ->nullable()
                ->after('id')
                ->constrained('categories')
                ->nullOnDelete();
        });

        // Backfill theo pivot hiện có:
        // ưu tiên Đồ Nữ (id=2), rồi Đồ Nam (id=1)
        // (chỉ chạy nếu có dữ liệu pivot)
        try {
            DB::statement("
                UPDATE products p
                JOIN category_product cp ON cp.product_id = p.id
                SET p.primary_category_id = 2
                WHERE cp.category_id = 2
            ");

            DB::statement("
                UPDATE products p
                JOIN category_product cp ON cp.product_id = p.id
                SET p.primary_category_id = 1
                WHERE p.primary_category_id IS NULL
                  AND cp.category_id = 1
            ");
        } catch (\Throwable $e) {
            // ignore backfill errors (e.g. fresh DB without pivot yet)
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('primary_category_id');
        });
    }
};

