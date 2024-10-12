<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductVariantRequest;
use App\Http\Resources\ProductVariantCollection;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProductVariantController extends Controller
{
    public function store(ProductVariantRequest $request): RedirectResponse
    {
        Gate::authorize('create', ProductVariant::class);

        ProductVariant::create($request->validated());

        return redirect()->back();
    }

    public function update(ProductVariantRequest $request, ProductVariant $variant): RedirectResponse
    {
        Gate::authorize('update', $variant);

        $variant->update($request->validated());

        return redirect()->back();
    }

    public function destroy(ProductVariantRequest $request, ProductVariant $variant): RedirectResponse
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

    public function validate(): JsonResponse
    {
        request()->validate([
            'id' => 'nullable|exists:product_variants,id',
            'product_id' => 'required_without:name|nullable|exists:products,id',
            'name' => [
                'required',
                'string',
                Rule::unique('products', 'name')->ignore(request()->input('product_id')),
            ],
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'buying_price' => 'required|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'stock_threshold' => 'nullable|integer|min:1',
            'sku_prefix' => [
                'required',
                Rule::unique('products', 'sku_prefix')->ignore(request()->input('product_id')),
            ],
        ], [
            'product_id.required_without' => 'Select or create a new product.',
            'name.required' => 'Select or create a new product.',
            'name.unique' => 'A product with this name already exists.',
            'sku_prefix.unique' => 'The SKU Prefix is already taken.',
            'quantity.min' => 'Must be at least 1.',
            'buying_price.min' => 'Must be at least 0.',
            'retail_price.min' => 'Must be at least 0.',
            'selling_price.min' => 'Must be at least 0.',
            'stock_threshold.min' => 'Must be at least 1.',
        ]);

        return response()->json(['success' => 'Product is valid.']);
    }
}
