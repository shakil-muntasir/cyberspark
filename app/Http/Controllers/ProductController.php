<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Product::class);

        $sortBy = request()->query('sortBy', 'id');
        $sortTo = request()->query('sortTo', 'asc');
        $paginate = (int) request()->input('per_page', 10);

        return inertia('Product/Index', [
            'products' => Product::orderBy($sortBy, $sortTo)->paginate($paginate),
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        Gate::authorize('create', Product::class);

        Product::create($request->validated());

        return redirect()->back();
    }
}
