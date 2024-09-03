<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductVariantRequest;
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

    public function destroy($_, ProductVariant $variant): RedirectResponse
    {
        Gate::authorize('delete', $variant);

        $variant->delete();

        return redirect()->back();
    }
}
