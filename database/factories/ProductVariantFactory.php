<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
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
            'sku' => strtoupper($this->faker->bothify('??###')),
            'quantity' => fake()->numberBetween(1, 100),
            'buying_price' => fake()->randomFloat(2, 1, 1999),
            'retail_price' => fake()->randomFloat(2, 1, 1999),
            'selling_price' => fake()->randomFloat(2, 1, 1999),
            'status' => fake()->randomElement(['active', 'inactive']),
            'created_by_id' => User::factory(),
            'updated_by_id' => User::factory(),
            'created_at' => fake()->dateTimeBetween('-15 days', '-7 days'),
            'updated_at' => fake()->dateTimeBetween('-6 days', '-1 days')
        ];
    }
}
