<?php

namespace Database\Factories;

use App\Models\Acquisition;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'acquisition_id' => Acquisition::factory(),
            'quantity' => fake()->numberBetween(10, 50),
            'buying_price' => fake()->randomFloat(2, 1000, 2000),
            'retail_price' => fake()->randomFloat(2, 1500, 2500),
            'selling_price' => fake()->randomFloat(2, 2000, 3000),
            'status' => fake()->randomElement(['active', 'inactive']),
            'created_at' => fake()->dateTimeBetween('-15 days', '-7 days'),
            'updated_at' => fake()->dateTimeBetween('-6 days', '-1 days'),
        ];
    }
}
