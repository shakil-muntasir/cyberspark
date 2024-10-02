<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\State;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Models\CourierService;
use App\Models\Order;
use App\Models\ProductVariant;
use DB;
use Illuminate\Http\RedirectResponse;
use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    public function index(OrderRequest $request): InertiaResponse
    {
        $order = Order::filterAndSort($request->validatedParams());

        return inertia('Order/Index', [
            'orders' => new OrderCollection($order),
        ]);
    }

    public function create(): InertiaResponse
    {
        return inertia('Order/Create', [
            'courier_services' => CourierService::getAllOptions(),
            'states' => State::getAllOptions()
        ]);
    }

    public function store(OrderRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $orderData = $request->validated();

            $order = Order::create($orderData);

            $this->createOrderVariants($order, $orderData['order_variants']);
            $this->addTransaction($order, $orderData);
            $order->shippingAddress()->create($request->input('address'));
        });

        return redirect()->route('orders.index');
    }

    public function show(Order $order): InertiaResponse
    {
        $order->load([
            'customer',
            'deliveryMan',
            'courierService',
            'orderVariants',
            'orderVariants.productVariant',
            'orderVariants.productVariant.product',
            'transactions',
            'transactions.audits.user',
            'shippingAddress',
            'audits.user'
        ])->loadSum('transactions', 'amount');

        return inertia('Order/Show', [
            'order' => new OrderResource($order),
            'statuses' => OrderStatus::getAllOptions()
        ]);
    }

    private function createOrderVariants(Order $order, array $order_variants): void
    {
        foreach ($order_variants as $variant) {
            $order->orderVariants()->create([
                'product_variant_id' => $variant['product_variant_id'],
                'quantity' => $variant['quantity'],
                'unit_price' => ProductVariant::find($variant['product_variant_id'])->selling_price,
            ]);
            $productVariant = ProductVariant::findOrFail($variant['product_variant_id']);
            $productVariant->update([
                'quantity' => $productVariant->quantity - $variant['quantity']
            ]);
        }
    }

    private function addTransaction(Order $order, array $orderData): void
    {
        if (!isset($orderData['total_paid']) || $orderData['total_paid'] === 0) {
            return;
        }

        $data = [
            'amount' => $orderData['total_paid'],
            'payment_method' => $orderData['payment_method'] ?? null,
            'service_provider' => $orderData['service_provider'] ?? null,
            'account_number' => $orderData['account_number'] ?? null,
            'txn_id' => $orderData['txn_id'] ?? null,
            'bank_name' => $orderData['bank_name'] ?? null,
            'cheque_number' => $orderData['cheque_number'] ?? null
        ];

        $order->transactions()->create($data);
    }
}
