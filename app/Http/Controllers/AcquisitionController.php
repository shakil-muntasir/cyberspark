<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class AcquisitionController extends Controller
{
    public function index()
    {
        return inertia('Acquisition/Index', [
            'categories' => Category::getAllOptions(),
        ]);
    }
}
