<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShippingAddress>
 */
class ShippingAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'contact_number' => fake()->phoneNumber,
            'email' => fake()->safeEmail,
            'street' => fake()->streetName,
            'city' => fake()->city,
            'state' => fake()->randomElement(['dhaka', 'chattogram', 'khulna', 'rajshahi', 'barishal', 'sylhet', 'rangpur', 'mymensingh']),
            'zip' => fake()->numerify('####'),
        ];
    }
}
