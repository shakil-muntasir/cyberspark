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
        //
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
                'product_id' => (string) $this->product_id,
                'sku' => $this->whenLoaded('product', fn() => $this->product->sku_prefix . sprintf('%05d', $this->id)),
                'quantity' => $this->quantity,
                'buying_price' => $this->buying_price,
                'retail_price' => $this->retail_price,
                'selling_price' => $this->selling_price,
                'status' => $this->status,
                'created_by' => $this->created_by,
                'updated_by' => $this->updated_by,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ]
        ];
    }
}
