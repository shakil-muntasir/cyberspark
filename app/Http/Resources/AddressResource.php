<?php

namespace App\Http\Resources;

use App\Traits\HasRelationships;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    use HasRelationships;

    protected array $relationships = [];

    protected function getAttributes(Request $request = null): array
    {
        return [
            'type' => 'addresses',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'street' => $this->street,
                'city' => $this->city,
                'state' => $this->state,
                'zip' => $this->zip,
                'country' => $this->country,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ],
        ];
    }
}
