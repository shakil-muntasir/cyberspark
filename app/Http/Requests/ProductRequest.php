<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sku' => 'required|string|unique:products,sku',
            'sku' => ['required', 'string', Rule::unique('products', 'sku')->ignore($this->route('product'))],
            'name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer',
            'buying_price' => 'required|numeric',
            'retail_price' => 'nullable|numeric',
            'selling_price' => 'required|numeric',
            'status' => ['string', Rule::in(['active', 'inactive'])],
        ];
    }
}
