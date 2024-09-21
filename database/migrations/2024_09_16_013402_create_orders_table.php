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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users');
            $table->string('delivery_method');
            $table->decimal('delivery_cost', 10, 2);
            $table->foreignId('delivery_man_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('courier_service_id')->nullable()->constrained('courier_services');
            $table->decimal('total_payable', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
