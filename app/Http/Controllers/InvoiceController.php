<?php

namespace App\Http\Controllers;

use App\Models\Order;
use DB;
use Spatie\Browsershot\Browsershot;

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

        $itemsPerPage = 9;
        $items = collect($order->orderVariants);
        $pages = $items->chunk($itemsPerPage);

        // Render the HTML view from emails/invoice.blade.php
        $html = view('printables.invoice', compact('order', 'pages'))->render();

        // Determine the OS and set node and npm binaries accordingly
        $nodeBinary = '';
        $npmBinary = '';

        if (PHP_OS_FAMILY === 'Windows') {
            // Windows paths (adjust the paths based on your local environment)
            $nodeBinary = 'C:/Program Files/nodejs/node.exe'; // Example path for Node.js
            $npmBinary = 'C:/Program Files/nodejs/npm.cmd';   // Example path for npm
        } elseif (PHP_OS_FAMILY === 'Darwin') {
            // macOS paths
            $nodeBinary = '/usr/local/bin/node';
            $npmBinary = '/usr/local/bin/npm';
        } else {
            // Linux paths (default case)
            $nodeBinary = '/usr/bin/node';
            $npmBinary = '/usr/bin/npm';
        }

        // Generate the PDF using BrowserShot and stream it to the browser
        $pdf = Browsershot::html($html)
            ->setNodeBinary($nodeBinary)
            ->setNpmBinary($npmBinary)
            ->format('A4')
            ->pdf();  // Generate PDF as a string

        // Return the PDF as an inline response (open in a new tab)
        return response($pdf)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="order_' . $order->id . '_summary.pdf"');
    }
}
