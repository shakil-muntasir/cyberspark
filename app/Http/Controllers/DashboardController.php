<?php

namespace App\Http\Controllers;

use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    public function index(): InertiaResponse
    {
        return inertia('Dashboard');
    }
}
