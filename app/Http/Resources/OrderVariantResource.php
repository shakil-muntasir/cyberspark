<?php

namespace App\Http\Resources;

class OrderVariantResource extends JsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [
        'order' => OrderResource::class,
        'product_variant' => ProductVariantResource::class
    ];

    /**
     * Get the attributes of the resource.
     *
     * @return array<string, mixed>
     */
    protected function getAttributes(): array
    {
        return [
            'type' => 'order_variants',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'price' => $this->price,
                'quantity' => $this->quantity,
                'created_by' => $this->created_by,
                'updated_by' => $this->updated_by,
            ]
        ];
    }
}
