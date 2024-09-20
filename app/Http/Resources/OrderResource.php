<?php

namespace App\Http\Resources;

class OrderResource extends JsonResource
{
    /**
     * Define the relationships and their corresponding resource classes.
     *
     * @var array<string, string>
     */
    protected array $relationships = [
        'customer' => UserResource::class,
        'courierService' => CourierServiceResource::class,
        'deliveryMan' => UserResource::class,
        'variants' => ProductVariantResource::class
    ];

    /**
     * Get the attributes of the resource.
     *
     * @return array<string, mixed>
     */
    protected function getAttributes(): array
    {
        return [
            'type' => 'orders',
            'id' => (string) $this->id,
            'attributes' => [
                'id' => (string) $this->id,
                'code' => 'ORD' . sprintf('%05d', $this->id),
                'customer' => $this->whenLoaded('customer', fn() => $this->customer->name),
                'delivered_by' =>$this->delivered_by,
                'delivery_method' => $this->delivery_method,
                'delivery_cost' => $this->delivery_cost,
                'payment_status' => $this->payment_status,
                'total_payable' => $this->total_payable,
                'created_by_id' => (string) $this->created_by_id,
                'updated_by_id' => (string) $this->updated_by_id,
                'created_by' => $this->createdBy->name,
                'updated_by' => $this->updatedBy->name,
                'created_at' => $this->created_at->format('jS F, Y h:i A'),
                'updated_at' => $this->updated_at->format('jS F, Y h:i A'),
            ]
        ];
    }
}
