<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Response as InertiaResponse;

class ProductController extends Controller
{
    public function index(ProductRequest $request): InertiaResponse
    {
        Gate::authorize('viewAny', Product::class);

        $products = Product::filterAndSort($request->validatedParams());

        return inertia('Product/Index', [
            'products' => ProductResource::collection($products),
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        Gate::authorize('create', Product::class);

        /** @var \App\Models\User */
        $user = $request->user();

        Product::create(array_merge($request->validated(), [
            'created_by_id' => $user->id,
            'updated_by_id' => $user->id,
        ]));

        return redirect()->back();
    }

    public function show(Product $product): InertiaResponse
    {
        Gate::authorize('view', $product);

        return inertia('Product/Show', [
            'product' => new ProductResource($product->load('variants')),
            'statuses' => ProductStatus::getAllStatuses()
        ]);
    }
}
