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
        return [
            'invoice_number' => 'required',
            'acquired_date' => 'required|date',
            'products' => 'required|array',
            'products.*.name' => 'required|string',
            'products.*.category_id' => 'required|exists:categories,id',
            'products.*.product_id' => 'nullable|exists:products,id',
            'products.*.description' => 'nullable|string',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.buying_price' => 'required|numeric|min:0',
            'products.*.retail_price' => 'nullable|numeric|min:0',
            'products.*.selling_price' => 'required|numeric|min:0',
        ];
    }
}
