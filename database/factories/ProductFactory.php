<?php

namespace Database\Factories;

use App\Models\User;
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
            'sku' => strtoupper($this->faker->bothify('??###')),
            'name' => fake()->words(2, true),
            'description' => fake()->sentence,
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
