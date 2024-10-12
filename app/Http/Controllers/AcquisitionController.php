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
                    'stock_threshold' => $productRequestData['stock_threshold'],
                ];
                $variantData = [
                    'acquisition_id' => $acquisition->id,
                    'quantity' => $productRequestData['quantity'],
                    'buying_price' => $productRequestData['buying_price'],
                    'retail_price' => $productRequestData['retail_price'],
                    'selling_price' => $productRequestData['selling_price'],
                ];

                // if product id empty, create a new product
                if (empty($productRequestData['id'])) {
                    $product = Product::create($productData);
                } else {
                    $product = Product::find($productRequestData['id']);
                }

                $product->variants()->create($variantData);
            }
        });

        return redirect()->route('acquisitions.index');
    }

    public function show(Acquisition $acquisition): InertiaResponse
    {
        $acquisition->load([
            'variants',
            'variants.product',
            'audits.user'
        ])->loadCount('variants');

        return inertia('Acquisition/Show', [
            'categories' => Category::getAllOptions(),
            'acquisition' => new AcquisitionResource($acquisition),
        ]);
    }
}
