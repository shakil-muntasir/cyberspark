<?php

namespace App\Http\Resources;

class AddressResource extends JsonResource
{
    protected function getAttributes(): array
    {
        return [
            'type' => 'addresses',
            'id' => (string) $this->id,
            'attributes' => [
                'street' => $this->street,
                'city' => $this->city,
                'state' => $this->state,
                'zip' => $this->zip,
                'country' => $this->country,
                'created_by' => $this->created_by,
                'updated_by' => $this->updated_by,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ],
        ];
    }
}
