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
        'productVariant' => ProductVariantResource::class
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
                'quantity' => $this->quantity,
                'unit_price' => $this->unit_price,
                'subtotal' => $this->subtotal,
                'created_by' => $this->created_by,
                'updated_by' => $this->updated_by,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ]
        ];
    }
}
