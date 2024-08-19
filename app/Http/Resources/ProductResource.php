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
        $data = [
            'type' => 'products',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'status' => $this->status,
                'variants' => $this->variants()->count(),
                'total_stock' => $this->total_stock,
                'stock_status' => $this->stock_status,
                'created_by_id' => (string) $this->created_by_id,
                'updated_by_id' => (string) $this->updated_by_id,
                'created_by' => $this->createdBy->name,
                'updated_by' => $this->updatedBy->name,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ]
        ];

        $relationships = $this->loadRelationships([
            'variants' => ProductVariantResource::class,
            // Add new relationships here as needed
            // 'newRelationship' => NewRelationshipResource::class,
        ]);

        if (!empty($relationships)) {
            $data['relationships'] = $relationships;
        }

        return $data;
    }

    /**
     * Load and format relationships dynamically.
     *
     * @param  array<string, string>  $relationships
     * @return array<string, mixed>
     */
    protected function loadRelationships(array $relationships): array
    {
        $result = [];

        foreach ($relationships as $relation => $resource) {
            if ($this->relationLoaded($relation) && $this->$relation->isNotEmpty()) {
                $result[$relation] = $resource::collection($this->$relation);
            }
        }

        return $result;
    }
}
