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
}
