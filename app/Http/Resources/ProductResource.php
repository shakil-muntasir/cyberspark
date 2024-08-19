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
                'variants_count' => $this->variants_count,
                'total_stock' => $this->total_stock,
                'stock_status' => $this->stock_status,
                'created_by_id' => (string) $this->created_by_id,
                'updated_by_id' => (string) $this->updated_by_id,
                'created_by' => $this->whenLoaded('createdBy', fn() => $this->createdBy->name),
                'updated_by' => $this->whenLoaded('updatedBy', fn() => $this->updatedBy->name),
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ],
        ];

        // Dynamically load relationships
        $relationships = $this->dynamicLoadRelationships();

        if (!empty($relationships)) {
            $data['relationships'] = $relationships;
        }

        return $data;
    }

    /**
     * Dynamically load and format relationships based on what's loaded.
     *
     * @return array<string, mixed>
     */
    protected function dynamicLoadRelationships(): array
    {
        $result = [];

        // Loop through the loaded relationships and transform them
        foreach ($this->getRelations() as $relation => $value) {
            if ($this->relationLoaded($relation)) {
                $resourceClass = $this->getRelationshipResourceClass($relation);
                if ($resourceClass) {
                    $result[$relation] = $resourceClass::collection($this->$relation);
                }
            }
        }

        return $result;
    }

    /**
     * Determine the appropriate resource class for a given relationship.
     *
     * @param  string  $relation
     * @return string|null
     */
    protected function getRelationshipResourceClass(string $relation): ?string
    {
        // Define a mapping of relationship names to resource classes
        $relationshipResources = [
            'variants' => ProductVariantResource::class,
            // Add more relationships as needed
            // 'newRelationship' => NewRelationshipResource::class,
        ];

        return $relationshipResources[$relation] ?? null;
    }
}
