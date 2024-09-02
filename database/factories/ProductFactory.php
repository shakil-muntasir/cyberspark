<?php

namespace Database\Factories;

use App\Models\Category;
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
            'name' => fake()->words(2, true),
            'description' => fake()->sentence,
            'status' => fake()->randomElement(['active', 'inactive']),
            'category_id' => Category::factory(),
            'created_by_id' => User::factory(),
            'updated_by_id' => User::factory(),
            'created_at' => fake()->dateTimeBetween('-15 days', '-7 days'),
            'updated_at' => fake()->dateTimeBetween('-6 days', '-1 days')
        ];
    }
}
