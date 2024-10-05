<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        if ($this->isMethod('get')) {
            // No validation for GET requests
            return [];
        }

        return [
            'customer_id' => 'required|exists:users,id',
            'delivery_method' => 'required|string|in:in-house,external',
            'delivery_cost' => 'required|numeric',
            'delivery_man_id' => 'nullable|exists:users,id|required_if:delivery_method,in-house',
            'courier_service_id' => 'nullable|exists:courier_services,id|required_if:delivery_method,external',
            'sales_rep_id' => 'required|exists:users,id',
            'total_payable' => 'required|numeric',

            // Order variant fields
            'order_variants' => 'required|array',
            'order_variants.*.product_variant_id' => 'required|exists:product_variants,id',
            'order_variants.*.quantity' => 'required|integer',

            // Shipping address fields
            'address.contact_number' => 'required|string',
            'address.email' => 'required|email',
            'address.street' => 'required|string|max:255',
            'address.city' => 'required|string|max:255',
            'address.state' => 'required|string|max:255',
            'address.zip' => 'required|integer',

            // Transaction fields
            'payment_status' => 'nullable|in:paid,partial,due|required_if:payment_method,mobile_banking|required_if:payment_method,cheque',
            'total_paid' => 'nullable|numeric|required_if:payment_status,partial|required_if:payment_status,paid|lte:total_payable',
            'payment_method' => 'required|string',
            'service_provider' => 'nullable|required_if:payment_method,mobile_banking',
            'account_number' => 'nullable|required_if:payment_method,mobile_banking',
            'txn_id' => 'nullable|required_if:payment_method,mobile_banking', // reference number of mobile payment services
            'bank_name' => 'nullable|required_if:payment_method,cheque',
            'cheque_number' => 'nullable|required_if:payment_method,cheque',
        ];
    }

    public function messages()
    {
        return [
            'customer_id' => 'Select a customer.',
            'delivery_method' => 'Select a delivery method.',
            'delivery_man_id' => 'Select a delivery man.',
            'courier_service_id' => 'Select a courier service.',
            'sales_rep_id' => 'Select a sales representative.',

            'order_variants' => 'Add product(s) to cart.',

            'address.contact_number' => 'The contact number field is required.',
            'address.email' => 'The email field is required.',
            'address.street' => 'The street field is required.',
            'address.city' => 'The city field is required.',
            'address.state' => 'The state field is required.',
            'address.zip' => 'The zip field is required.',

            'payment_status.required_if' => 'Select a payment status.',
            'payment_method' => 'Select a payment method.',
            'total_paid.required_if' => 'Enter the partial payment amount.',
            'total_paid.lte' => 'The partial amount must be less than total payable.',
            'account_number' => 'Enter the account number.',
            'service_provider' => 'Select a service provider.',
            'txn_id' => 'Enter the transaction ID.',
            'bank_name' => 'The bank name field is required.',
            'cheque_number' => 'The cheque number field is required.',
        ];
    }

    public function validatedParams(): array
    {
        return [
            'search' => $this->query('search', ''),
            'sort_by' => $this->query('sortBy', null),
            'sort_to' => $this->query('sortTo', null),
            'per_page' => (int) $this->query('per_page', 10),
        ];
    }
}
