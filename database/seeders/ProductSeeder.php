<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::withoutEvents(function () {
            foreach (range(1, 25) as $i) {
                $product = Product::factory()->create([
                    'created_by_id' => User::inRandomOrder()->first()->id,
                    'updated_by_id' => User::inRandomOrder()->first()->id,
                ]);

                // Create 3-5 random variants for each product
                $variantsCount = rand(3, 5);
                ProductVariant::factory($variantsCount)->create([
                    'product_id' => $product->id,
                    'created_by_id' => User::inRandomOrder()->first()->id,
                    'updated_by_id' => User::inRandomOrder()->first()->id,
                ]);
            }
        });
    }
}
