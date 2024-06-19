<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return inertia('Order/Index');
    }
}
