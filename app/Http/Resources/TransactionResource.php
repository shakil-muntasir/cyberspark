<?php

namespace App\Http\Resources;

class TransactionResource extends JsonResource
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
            'type' => 'transactions',
            'id' => (string) $this->id,
            'attributes' => [
                'amount' => $this->amount,
                'payment_method' => $this->payment_method,
                'service_provider' => $this->service_provider,
                'account_number' => $this->account_number,
                'txn_id' => $this->txn_id,
                'bank_name' => $this->bank_name,
                'cheque_number' => $this->cheque_number
            ]
        ];
    }
}
