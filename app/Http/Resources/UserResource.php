<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'users',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'phone' => $this->phone,
                'image' => $this->image ? asset("storage/{$this->image}") : null,
                'address' => $this->whenLoaded('address', fn() => $this->address->street) ?? 'N/A',
                'status' => $this->status,
                'roles' => $this->whenLoaded('roles', fn() => $this->roles->pluck('name'), []),
                'created_by' => $this->whenLoaded('creator', fn() => $this->creator->name) ?? 'N/A',
                'email_verified_at' => $this->email_verified_at,
            ]
        ];
    }
}
