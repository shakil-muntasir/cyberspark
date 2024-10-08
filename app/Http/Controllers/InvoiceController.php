<?php

namespace App\Http\Controllers;

use App\Models\Order;
use DB;
use Barryvdh\DomPDF\Facade\Pdf;

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

        $itemsPerPage = 10;
        $items = collect($order->orderVariants);
        $pages = $items->chunk($itemsPerPage);

        $pdf = Pdf::loadView('printables.invoice', compact('order', 'pages'));

        return response($pdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="order_' . $order->code . '.pdf"');
    }
}
