<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource as BaseJsonResource;
use Str;

abstract class JsonResource extends BaseJsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     * This should be defined in the child classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [];

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $data = $this->getAttributes();

        // Dynamically load relationships
        $relationships = $this->dynamicLoadRelationships();

        if (!empty($relationships)) {
            $data['relationships'] = $relationships;
        }

        return $data;
    }

    /**
     * Get the attributes of the resource.
     * This should be implemented in the child classes.
     *
     * @return array<string, mixed>
     */
    abstract protected function getAttributes(): array;

    /**
     * Dynamically load and format relationships based on what's loaded.
     *
     * @return array<string, mixed>
     */
    protected function dynamicLoadRelationships(): array
    {
        $result = [];

        foreach ($this->relationships as $relation => $resourceClass) {
            if ($this->relationLoaded($relation)) {
                $relationValue = $this->$relation;

                // Convert the relationship name to snake_case
                $snakeRelation = Str::snake($relation);

                // Check if the relation is a collection (e.g., hasMany) or a single model (e.g., hasOne)
                if ($relationValue instanceof \Illuminate\Database\Eloquent\Collection) {
                    $result[$snakeRelation] = $resourceClass::collection($relationValue);
                } elseif ($relationValue !== null) { // Handles hasOne or belongsTo relationships
                    $result[$snakeRelation] = new $resourceClass($relationValue);
                }
            }
        }

        return $result;
    }
}
