<?php

namespace Database\Seeders;

use App\Models\CourierService;
use App\Models\Order;
use App\Models\OrderVariant;
use App\Models\ProductVariant;
use App\Models\ShippingAddress;
use App\Models\Transaction;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orderCount = rand(15, 25);  // Randomly creating between 15-25 orders
        for ($i = 0; $i < $orderCount; $i++) {
            $this->createRandomOrder();
        }
    }

    private function createRandomOrder()
    {
        $productVariants = ProductVariant::inRandomOrder()->limit(rand(1, 5))->get(); // Randomly select 1 to 5 variants
        $deliveryMethod = fake()->randomElement(['in-house', 'external']);
        // Default delivery charge for in-house
        $courierService = CourierService::inRandomOrder()->first();  // Random courier charge for external delivery

        // Initialize total payable
        $totalPayable = 0;

        // Initialize an array to store quantities for each product variant
        $variantQuantities = [];

        // Calculate total payable based on product variants and their quantities
        foreach ($productVariants as $productVariant) {
            $quantity = rand(1, 5); // Random quantity for each variant
            $variantQuantities[$productVariant->id] = $quantity;  // Store the quantity for later use
            $totalPayable += $productVariant->selling_price * $quantity;
        }

        // If delivery method is external, add courier charge instead of fixed delivery charge
        $deliveryCharge = 60;
        if ($deliveryMethod === 'external') {
            $deliveryCharge = $courierService->delivery_price;
        }

        $totalPayable += $deliveryCharge;

        // Create Order
        $order = Order::factory()->create([
            'customer_id' => User::role('customer')->inRandomOrder()->first()->id,
            'delivery_method' => $deliveryMethod,
            'delivery_cost' => $deliveryCharge,
            'delivery_man_id' => $deliveryMethod === 'in-house' ? User::role('delivery_man')->inRandomOrder()->first()->id : null,
            'courier_service_id' => $deliveryMethod === 'external' ? $courierService->id : null,
            'total_payable' => $totalPayable,  // Correctly set total payable
        ]);

        // Create Shipping Address
        ShippingAddress::factory()->create([
            'order_id' => $order->id,
        ]);

        // Create Order Variants using the previously stored quantities
        foreach ($productVariants as $productVariant) {
            $quantity = $variantQuantities[$productVariant->id];  // Use stored quantity
            OrderVariant::factory()->create([
                'order_id' => $order->id,
                'product_variant_id' => $productVariant->id,
                'quantity' => $quantity,  // Use the same quantity as in totalPayable calculation
                'unit_price' => $productVariant->selling_price,
            ]);
            $productVariant->update([
                'quantity' => $productVariant->quantity - $quantity
            ]);
        }

        // Handle Transactions based on Payment Status
        $this->createTransactions($order);
    }

    private function createTransactions(Order $order)
    {
        // Fetch existing transactions for this order
        $existingTransactions = Transaction::where('order_id', $order->id)->sum('amount');

        // If the total amount of existing transactions already matches the total payable, mark the order as paid and skip further transactions
        if ($existingTransactions >= $order->total_payable) {
            return;  // No need to create further transactions
        }

        // Generate a random payment status (due, partial, or paid) if none exists
        $paymentStatus = fake()->randomElement(['due', 'partial', 'paid']);

        // If the payment status is 'due', don't create any transactions
        if ($paymentStatus === 'due') {
            return;
        }

        // If the payment status is 'partial', create 1-2 transactions without exceeding the total payable amount
        if ($paymentStatus === 'partial') {
            $transactionCount = rand(1, 2);
            $totalPaid = $existingTransactions;

            for ($i = 0; $i < $transactionCount; $i++) {
                $remainingAmount = $order->total_payable - $totalPaid;

                // Stop creating transactions if the remaining amount is 0 or less
                if ($remainingAmount <= 0) {
                    break;
                }

                // For the last transaction, ensure the sum doesn't exceed total payable
                if ($i == $transactionCount - 1) {
                    $transactionAmount = fake()->randomFloat(2, 1, $remainingAmount);
                } else {
                    $transactionAmount = fake()->randomFloat(2, 1, $remainingAmount / 2);
                }

                // Create the transaction
                $this->createTransaction($order, $transactionAmount);

                // Update total paid so far
                $totalPaid += $transactionAmount;
            }

            return;
        }

        // If payment status is 'paid', create one full transaction and stop further transactions
        if ($paymentStatus === 'paid') {
            $this->createTransaction($order, $order->total_payable);
            return;
        }
    }


    private function createTransaction(Order $order, $amount)
    {
        // Generate a random payment method
        $paymentMethod = fake()->randomElement(['cash_on_delivery', 'mobile_banking', 'cheque']);

        // Initialize transaction data
        $transactionData = [
            'order_id' => $order->id,
            'amount' => $amount,
            'payment_method' => $paymentMethod,
            'service_provider' => null,  // Set to null by default
            'account_number' => null,
            'txn_id' => null,
            'bank_name' => null,
            'cheque_number' => null
        ];

        // Handle additional fields based on payment method
        if ($paymentMethod === 'mobile_banking') {
            // Set mobile banking fields
            $transactionData['service_provider'] = fake()->randomElement(['bkash', 'nagad', 'rocket', 'upay']);
            $transactionData['account_number'] = fake()->bankAccountNumber;
            $transactionData['txn_id'] = fake()->uuid;
        } elseif ($paymentMethod === 'cheque') {
            // Set cheque-specific fields
            $transactionData['bank_name'] = fake()->company;
            $transactionData['cheque_number'] = fake()->bothify('###-######');
        }

        // Create the transaction with the data
        Transaction::factory()->create($transactionData);
    }
}
