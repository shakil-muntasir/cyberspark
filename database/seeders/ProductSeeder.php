<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (range(1, 25) as $i) {
            $product = Product::factory()->create([
                'category_id' => Category::inRandomOrder()->first()->id,
            ]);

            // Create 3-5 random variants for each product
            $variantsCount = rand(3, 5);
            ProductVariant::factory($variantsCount)->create([
                'product_id' => $product->id,
            ]);
        }
    }
}
