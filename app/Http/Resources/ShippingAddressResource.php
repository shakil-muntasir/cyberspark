<?php

namespace App\Http\Resources;

class ShippingAddressResource extends JsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [
        'order' => OrderResource::class
    ];

    /**
     * Get the attributes of the resource.
     *
     * @return array<string, mixed>
     */
    protected function getAttributes(): array
    {
        return [
            'type' => 'shipping_addresses',
            'id' => (string) $this->id,
            'attributes' => [
                'contact_number' => $this->contact_number,
                'email' => $this->email,
                'street' => $this->street,
                'city' => $this->city,
                'state' => $this->state,
                'zip' => $this->zip,
            ]
        ];
    }
}
