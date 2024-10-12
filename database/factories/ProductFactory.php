<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'sku_prefix' => $this->uniqueSkuPrefix(),
            'description' => fake()->sentence,
            'status' => fake()->randomElement(['active', 'inactive']),
            'category_id' => Category::factory(),
            'stock_threshold' => fake()->numberBetween(1,10),
            'created_at' => fake()->dateTimeBetween('-15 days', '-7 days'),
            'updated_at' => fake()->dateTimeBetween('-6 days', '-1 days')
        ];
    }

    private function uniqueSkuPrefix(): string
    {
        do {
            // Generate a random 3-letter SKU prefix
            $skuPrefix = strtoupper(fake()->lexify('???'));
        } while (Product::where('sku_prefix', $skuPrefix)->exists()); // Check if it exists in the database

        return $skuPrefix;
    }
}
