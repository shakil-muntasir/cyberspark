<?php

namespace App\Http\Resources;

class AcquisitionResource extends JsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [
        'variants' => ProductVariantResource::class,
    ];

    /**
     * Get the attributes of the resource.
     *
     * @return array<string, mixed>
     */
    protected function getAttributes(): array
    {
        return [
            'type' => 'acquisitions',
            'id' => (string) $this->id,
            'attributes' => [
                'invoice_number' => $this->invoice_number,
                'acquired_date' => $this->acquired_date->format('m-d-Y'),
                'variants_count' => $this->variants_count,
                'created_by' => $this->created_by,
                'updated_by' => $this->updated_by,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ],
        ];
    }
}
