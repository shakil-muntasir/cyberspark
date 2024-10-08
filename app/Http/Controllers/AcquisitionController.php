<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcquisitionRequest;
use App\Http\Resources\AcquisitionCollection;
use App\Http\Resources\AcquisitionResource;
use App\Models\Acquisition;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Response as InertiaResponse;

class AcquisitionController extends Controller
{
    public function index(AcquisitionRequest $request): InertiaResponse
    {
        Gate::authorize('viewAny', Acquisition::class);

        $acquisitions = Acquisition::filterAndSort($request->validatedParams());

        return inertia('Acquisition/Index', [
            'acquisitions' => new AcquisitionCollection($acquisitions),
            'categories' => Category::getAllOptions(),
        ]);
    }

    public function store(AcquisitionRequest $request): RedirectResponse
    {
        Gate::authorize('create', Acquisition::class);

        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $acquisition = Acquisition::create([
                'invoice_number' => $data['invoice_number'],
                'acquired_date' => $data['acquired_date'],
            ]);

            foreach ($data['products'] as $productRequestData) {
                $productData = [
                    'name' => $productRequestData['name'],
                    'sku_prefix' => $productRequestData['sku_prefix'],
                    'category_id' => $productRequestData['category_id'],
                    'description' => $productRequestData['description'],
                ];
                $variantData = [
                    'quantity' => $productRequestData['quantity'],
                    'buying_price' => $productRequestData['buying_price'],
                    'retail_price' => $productRequestData['retail_price'],
                    'selling_price' => $productRequestData['selling_price'],
                ];

                if (empty($productRequestData['id'])) {
                    $product = Product::create($productData);
                } else {
                    $product = Product::find($productRequestData['id']);
                }

                $product->variants()->create($variantData);

                $acquisition->products()->attach($product);
            }
        });

        return redirect()->route('acquisitions.index');
    }

    public function show(Acquisition $acquisition): InertiaResponse
    {
        $acquisition->load([
            'products',
            'products.variants',
            'audits.user'
        ])->loadCount('products');

        return inertia('Acquisition/Show', [
            'acquisition' => new AcquisitionResource($acquisition)
        ]);
    }
}
