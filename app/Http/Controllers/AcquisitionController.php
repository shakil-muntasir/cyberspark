<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AcquisitionController extends Controller
{
    public function index()
    {
        return inertia('Acquisition/Index');
    }
}
