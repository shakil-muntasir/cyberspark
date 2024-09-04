<?php

namespace App\Http\Resources;

class ProductVariantResource extends JsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [
        'product' => ProductResource::class,
    ];

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function getAttributes(): array
    {
        return [
            'type' => 'product_variants',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'product_id' => (string) $this->product_id,
                'sku' => $this->sku,
                'quantity' => $this->quantity,
                'buying_price' => $this->buying_price,
                'retail_price' => $this->retail_price,
                'selling_price' => $this->selling_price,
                'status' => $this->status,
                'created_by_id' => (string) $this->created_by_id,
                'updated_by_id' => (string) $this->updated_by_id,
                'created_by' => $this->createdBy->name,
                'updated_by' => $this->updatedBy->name,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ]
        ];
    }
}
