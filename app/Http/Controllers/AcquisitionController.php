<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcquisitionRequest;
use App\Http\Resources\AcquisitionCollection;
use App\Http\Resources\AcquisitionResource;
use App\Models\Acquisition;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
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

                // if product id empty, create a new product
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

    public function productValidate(): JsonResponse
    {
        request()->validate([
            'id' => 'required_without:name|nullable|exists:products,id',
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'product_id' => 'nullable|exists:products,id',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'buying_price' => 'required|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'sku_prefix' => [
                'required',
                Rule::unique('products', 'sku_prefix')->ignore(request()->input('id')),
            ],
        ], [
            'id.required_without' => 'Select or create a new product.',
            'name.required' => 'Select or create a new product.',
            'sku_prefix.unique' => 'The SKU Prefix is already taken.'
        ]);

        return response()->json(['success' => 'Product is valid.']);
    }
}
