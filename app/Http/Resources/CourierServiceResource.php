<?php

namespace App\Http\Resources;

class CourierServiceResource extends JsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [
        // set relationship property name and it's corresponding resource class
        // 'users' => UserResource::class,
    ];

    /**
     * Get the attributes of the resource.
     *
     * @return array<string, mixed>
     */
    protected function getAttributes(): array
    {
        return [
            'type' => 'courier_service',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'name' => $this->name,
                'delivery_price' => $this->delivery_price
            ]
        ];
    }
}
