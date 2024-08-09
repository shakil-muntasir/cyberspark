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
            'name' => $this->faker->words(2, true),
            'description' => $this->faker->sentence,
            'quantity' => $this->faker->numberBetween(1, 100),
            'buying_price' => $this->faker->randomFloat(2, 1, 1999),
            'retail_price' => $this->faker->randomFloat(2, 1, 1999),
            'selling_price' => $this->faker->randomFloat(2, 1, 1999),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'created_by' => User::factory(),
        ];
    }
}
