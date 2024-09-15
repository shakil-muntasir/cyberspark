<?php

namespace App\Http\Controllers;

use App\Enums\State;
use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    public function index(): InertiaResponse
    {
        return inertia('Order/Index');
    }

    public function create(): InertiaResponse
    {
        return inertia('Order/Create', [
            'states' => State::getAllOptions()
        ]);
    }
}
