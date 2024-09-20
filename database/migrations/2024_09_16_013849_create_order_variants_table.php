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
        Schema::create('order_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->nullOnDelete();
            $table->foreignId('product_variant_id')->constrained('product_variants')->nullOnDelete();
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // saving the current price of the variant
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_variants');
    }
};
