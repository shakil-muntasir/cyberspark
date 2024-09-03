<?php

namespace App\Http\Resources;

class ProductResource extends JsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [
        'variants' => ProductVariantResource::class,
    ];

    /**
     * Get the attributes of the resource.
     *
     * @return array<string, mixed>
     */
    protected function getAttributes(): array
    {
        // TODO: match the types with frontend for all resources
        return [
            'type' => 'products',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'status' => $this->status,
                'variants_count' => $this->variants_count,
                'variants_sum_quantity' => $this->variants_sum_quantity ?? 0,
                'availability' => $this->availability,
                'category' => $this->whenLoaded('category', fn() => $this->category->name),
                'category_id' => (string) $this->category_id,
                'created_by_id' => (string) $this->created_by_id,
                'updated_by_id' => (string) $this->updated_by_id,
                'created_by' => $this->whenLoaded('createdBy', fn() => $this->createdBy->name),
                'updated_by' => $this->whenLoaded('updatedBy', fn() => $this->updatedBy->name),
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ],
        ];
    }
}
