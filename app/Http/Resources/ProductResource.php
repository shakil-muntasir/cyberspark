<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'products',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'sku' => $this->sku,
                'name' => $this->name,
                'description' => $this->description,
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
