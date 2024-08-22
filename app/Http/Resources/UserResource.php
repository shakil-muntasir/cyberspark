<?php

namespace App\Http\Resources;

class UserResource extends JsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [
        'address' => AddressResource::class,
        'roles' => RoleResource::class,
    ];

    /**
     * Get the attributes of the resource.
     *
     * @return array<string, mixed>
     */
    protected function getAttributes(): array
    {
        return [
            'type' => 'users',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'name' => $this->name,
                'gender' => $this->gender,
                'email' => $this->email,
                'phone' => $this->phone,
                'image' => $this->image ? asset("storage/{$this->image}") : null,
                'status' => $this->status,
                'created_by_id' => $this->created_by_id,
                'created_by' => $this->whenLoaded('createdBy', fn() => $this->createdBy->name) ?? 'N/A',
                'email_verified_at' => $this->email_verified_at,
            ],
        ];
    }
}
