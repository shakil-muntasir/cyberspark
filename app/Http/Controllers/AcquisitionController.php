<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcquisitionRequest;
use App\Http\Resources\AcquisitionResource;
use App\Models\Acquisition;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class AcquisitionController extends Controller
{
    public function index(AcquisitionRequest $request)
    {
        Gate::authorize('viewAny', Acquisition::class);

        $acquisitions = Acquisition::filterAndSort($request->validatedParams());

        return inertia('Acquisition/Index', [
            'acquisitions' => AcquisitionResource::collection($acquisitions),
            'categories' => Category::getAllOptions(),
        ]);
    }

    public function store(AcquisitionRequest $request): RedirectResponse
    {
        Gate::authorize('create', Acquisition::class);

        /** @var \App\Models\User */
        $user = $request->user();

        $data = $request->validated();

        DB::transaction(function () use ($data, $user) {
            $acquisition = $user->acquisitions()->create([
                'invoice_number' => $data['invoice_number'],
                'acquired_date' => $data['acquired_date'],
            ]);

            foreach ($data['products'] as $productRequestData) {
                // TODO: implement product select or create
                $product = $acquisition->products()->create([
                    'name' => $productRequestData['name'],
                    'category_id' => $productRequestData['category_id'],
                    'description' => $productRequestData['description']
                ]);

                $product->variants()->create([
                    'sku' => 'SKU-' . $product->id,
                    'quantity' => $productRequestData['quantity'],
                    'buying_price' => $productRequestData['buying_price'],
                    'retail_price' => $productRequestData['retail_price'],
                    'selling_price' => $productRequestData['selling_price'],
                ]);
            }
        });

        return redirect()->route('acquisitions.index');
    }
}
