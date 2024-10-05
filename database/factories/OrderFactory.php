<?php

namespace Database\Factories;

use App\Models\CourierService;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public const MIN_PAYABLE = 10_000;
    public const MAX_PAYABLE = 30_000;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'delivery_method' => fake()->randomElement(['in-house', 'external']),
            'delivery_cost' => fake()->randomElement([60, 100]),
            'delivery_man_id' => User::factory(),
            'courier_service_id' => CourierService::factory(),
            'sales_rep_id' => User::factory(),
            'status' => fake()->randomElement(['pending', 'shipping', 'received', 'complete']),
            'total_payable' => fake()->randomFloat(2, self::MIN_PAYABLE, self::MAX_PAYABLE),
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (Order $order) {
            if ($order->delivery_method == 'in-house') {
                $order->delivery_man_id = $order->delivery_man_id ?? User::factory();
                $order->delivery_cost = 60;
                $order->courier_service_id = null;
            } else if ($order->delivery_method == 'external') {
                if (isset($order->courier_service_id)) {
                    $courierService = CourierService::findOrFail($order->courier_service_id);
                } else {
                    $courierService = CourierService::factory()->create();
                }
                $order->courier_service_id = $courierService->id;
                $order->delivery_cost = $courierService->delivery_price;
                $order->delivery_man_id = null;
            }
        });
    }
}
