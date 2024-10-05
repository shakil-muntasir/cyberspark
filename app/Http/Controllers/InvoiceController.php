<?php

namespace App\Http\Controllers;

use App\Models\Order;
use DB;

class InvoiceController extends Controller
{
    public function show(Order $order)
    {
        $order->load([
            'customer',
            'orderVariants',
            'orderVariants.productVariant',
            'orderVariants.productVariant.product',
            'salesRep',
            'shippingAddress',
        ])->loadSum('transactions', 'amount')
            ->loadSum(['orderVariants as total_subtotal' => function ($query) {
                $query->select(DB::raw('SUM(quantity * unit_price)'));
            }], 'subtotal');

        return view('emails.invoice', [
            'order' => $order
        ]);
    }
}
