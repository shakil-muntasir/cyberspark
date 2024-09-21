<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
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
            'amount' => fake()->randomFloat(2, OrderFactory::MIN_PAYABLE - 100, OrderFactory::MAX_PAYABLE - 100),
            'payment_method' => fake()->randomElement(['cash_on_delivery', 'mobile_banking', 'cheque']),
            'service_provider' => fake()->randomElement(['bkash', 'nagad', 'rocket', 'upay']),
            'account_number' => fake()->bankAccountNumber,
            'txn_id' => fake()->uuid,
            'bank_name' => fake()->company,
            'cheque_number' => fake()->bothify('###-######'),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (Transaction $transaction) {
            $order = null;

            // Fetch or create the order associated with the transaction
            if (isset($transaction->order_id)) {
                $order = Order::findOrFail($transaction->order_id);
            } else {
                $order = Order::factory()->create();
            }

            $transaction->order_id = $order->id;

            // Set the appropriate fields for mobile banking or cheque payments
            if ($transaction->payment_method == 'mobile_banking') {
                $transaction->service_provider = fake()->randomElement(['bkash', 'nagad', 'rocket', 'upay']);
                $transaction->account_number = fake()->bankAccountNumber;
                $transaction->txn_id = fake()->uuid;
            } else if ($transaction->payment_method == 'cheque') {
                $transaction->bank_name = fake()->company;
                $transaction->cheque_number = fake()->bothify('###-######');
            }
        });
    }
}
