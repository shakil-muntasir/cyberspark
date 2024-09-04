<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AcquisitionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * 
     * TODO: check the documentation about this method
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->isMethod('get')) {
            // No validation for GET requests
            return [];
        }

        return [
            'invoice_number' => 'required',
            'acquired_date' => 'required|date',
            'products' => 'required|array',
            'products.*.name' => 'required|string',
            'products.*.sku_prefix' => 'required|unique:products,sku_prefix',
            'products.*.category_id' => 'required|exists:categories,id',
            'products.*.product_id' => 'nullable|exists:products,id',
            'products.*.description' => 'nullable|string',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.buying_price' => 'required|numeric|min:0',
            'products.*.retail_price' => 'nullable|numeric|min:0',
            'products.*.selling_price' => 'required|numeric|min:0',
        ];
    }

    /**
     * Sanitize and retrieve query parameters.
     *
     * @return array<string, mixed>
     */
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
