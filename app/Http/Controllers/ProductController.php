<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Models\Category;
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
            'products' => new ProductCollection($products),
            'categories' => Category::getAllOptions(),
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        Gate::authorize('create', Product::class);

        Product::create($request->validated());

        return redirect()->back();
    }

    public function show(Product $product): InertiaResponse
    {
        Gate::authorize('view', $product);

        $product->load([
            'category:id,name',
            'variants',
            'variants.product',
            'audits.user'
        ])->loadSum('variants', 'quantity');

        return inertia('Product/Show', [
            'categories' => Category::getAllOptions(),
            'product' => new ProductResource($product),
            'statuses' => ProductStatus::getAllOptions(),
        ]);
    }

    public function dropdown(): ProductCollection
    {
        $search = request()->input('search');

        // TODO: revisit and take closer look into this query later.
        $products = Product::with(['category'])
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%$search%")
                    ->orWhere('sku_prefix', 'like', "%$search%");
            })
            ->latest('id')
            ->take(10)
            ->get();

        return new ProductCollection($products);
    }
}
