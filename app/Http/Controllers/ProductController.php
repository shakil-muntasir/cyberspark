<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Product::class);

        $searchWith = request()->query('search', '');
        $active = filter_var(request()->query('active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        $inactive = filter_var(request()->query('inactive'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        $sortBy = request()->query('sortBy', 'id');
        $sortTo = request()->query('sortTo', 'asc');
        $paginate = (int) request()->input('per_page', 10);

        $products = Product::search($searchWith)
            ->when($active, fn ($q) => $q->active())
            ->when($inactive, fn ($q) => $q->inactive())
            ->orderBy($sortBy, $sortTo)
            ->paginate($paginate);

        return inertia('Product/Index', [
            'products' => ProductResource::collection($products),
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        Gate::authorize('create', Product::class);

        /** @var \App\Models\User */
        $user = $request->user();

        $user->products()->create($request->validated());

        return redirect()->back();
    }
}
