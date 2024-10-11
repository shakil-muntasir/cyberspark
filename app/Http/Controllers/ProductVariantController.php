<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductVariantRequest;
use App\Http\Resources\ProductVariantCollection;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ProductVariantController extends Controller
{
    public function store(ProductVariantRequest $request, Product $product): RedirectResponse
    {
        Gate::authorize('create', ProductVariant::class);

        $product->variants()->create($request->validated());

        return redirect()->back();
    }

    public function update(ProductVariantRequest $request, $_, ProductVariant $variant): RedirectResponse
    {
        Gate::authorize('update', $variant);

        $variant->update($request->validated());

        return redirect()->back();
    }

    public function destroy(ProductVariantRequest $request, $_, ProductVariant $variant): RedirectResponse
    {
        Gate::authorize('delete', $variant);

        // NOTE: this checks if the variant is associated with any order
        $request->validated();

        $variant->delete();

        return redirect()->back();
    }

    public function dropdown(): ProductVariantCollection
    {
        $search = request()->input('search');

        $variants = ProductVariant::with(['product', 'product.category'])
            ->when($search, function ($query, $search) {
                return $query->whereHas('product', function ($query) use ($search) {
                    $query->where('name', 'like', "%$search%")
                        ->orWhereRaw("CONCAT(products.sku_prefix, LPAD(product_variants.id, 5, '0')) LIKE ?", ["%$search%"]);
                });
            })
            ->latest('id')
            ->take(10)
            ->get();

        return new ProductVariantCollection($variants);
    }
}
