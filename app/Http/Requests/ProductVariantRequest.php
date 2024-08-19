<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductVariantRequest extends FormRequest
{
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
            'product_id' => 'required|exists:products,id',
            'sku' => [
                'required',
                'string',
                Rule::unique('product_variants', 'sku')->ignore($this->route('variant')),
            ],
            'quantity' => 'required|integer',
            'buying_price' => 'required|numeric',
            'retail_price' => 'nullable|numeric',
            'selling_price' => 'required|numeric',
        ];
    }

    /**
     * Sanitize and retrieve query parameters.
     *
     * @return array<string, mixed>
     */

    // TODO: if needed
    // public function validatedParams(): array
    // {
    //     return [
    //         'search' => $this->query('search', ''),
    //         'sort_by' => $this->query('sortBy', 'id'),
    //         'sort_to' => $this->query('sortTo', 'asc'),
    //         'per_page' => (int) $this->query('per_page', 10),
    //     ];
    // }
}
