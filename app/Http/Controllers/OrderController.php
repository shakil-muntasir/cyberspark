<?php

namespace App\Http\Controllers;

use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    public function index(): InertiaResponse
    {
        return inertia('Order/Index');
    }
}
