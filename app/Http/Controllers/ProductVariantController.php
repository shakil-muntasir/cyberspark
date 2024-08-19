<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Http\Requests\ProductVariantRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductVariantResource;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Response as InertiaResponse;

class ProductVariantController extends Controller
{
    public function store(ProductVariantRequest $request): RedirectResponse
    {
        Gate::authorize('create', ProductVariant::class);

        /** @var \App\Models\User */
        $user = $request->user();

        ProductVariant::create(array_merge($request->validated(), [
            'created_by_id' => $user->id,
            'updated_by_id' => $user->id,
        ]));

        return redirect()->back();
    }
}
