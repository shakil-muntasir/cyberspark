<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Str;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function getAttributes(): array
    {
        return [
            'type' => 'roles',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'label' => Str::title(str_replace('_', ' ', $this->name)),
                'value' => $this->name,
                'guard_name' => $this->guard_name,
                'created_by' => $this->created_by,
                'updated_by' => $this->updated_by,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ],
        ];
    }
}
