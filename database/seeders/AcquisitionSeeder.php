<?php

namespace Database\Seeders;

use App\Models\Acquisition;
use App\Models\Product;
use DB;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcquisitionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5-10 acquisitions
        Acquisition::factory()->count(rand(5, 10))->create()->each(function ($acquisition) {
            // For each acquisition, assign 5-10 products
            $products = Product::inRandomOrder()->take(rand(3, 5))->get();

            // Add some new products (create 3-5 new products)
            $newProducts = Product::factory()->count(rand(2, 5))->create();

            // Combine existing and new products
            $allProducts = $products->merge($newProducts);

            // Attach products to the acquisition
            foreach ($allProducts as $product) {
                DB::transaction(function () use ($acquisition, $product) {
                    // Create variant data for the product
                    $variantData = [
                        'acquisition_id' => $acquisition->id,
                        'quantity' => rand(1, 100),
                        'buying_price' => rand(100, 1000),
                        'retail_price' => rand(100, 1200),
                        'selling_price' => rand(100, 1300),
                        'status' => rand(0, 1) ? 'active' : 'inactive'
                    ];

                    // Create a variant for each product
                    $product->variants()->create($variantData);
                });
            }
        });
    }
}
