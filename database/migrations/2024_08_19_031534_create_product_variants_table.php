<?php

use App\Enums\ProductVariantStatus;
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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('acquisition_id')->nullable()->constrained('acquisitions')->nullOnDelete();
            $table->integer('quantity');
            $table->decimal('buying_price', 10, 2);
            $table->decimal('retail_price', 10, 2)->nullable();
            $table->decimal('selling_price', 10, 2);
            $table->string('status')->default(ProductVariantStatus::ACTIVE);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
