<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class ProductVariantRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $IGNORED_METHODS = ['get', 'delete'];
        if (in_array(strtolower($this->method()), $IGNORED_METHODS)) {
            // No validation for ignored request methods
            return [];
        }

        return [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'buying_price' => 'required|numeric|min:0',
            'retail_price' => 'nullable|numeric|min:0',
            'selling_price' => 'required|numeric|min:0'
        ];
    }

    /**
     * Perform additional validation after the main rules have passed.
     *
     * @param Validator $validator
     * 
     * @return void
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            // Only perform these checks for DELETE requests
            if ($this->isMethod('delete')) {
                $variant = $this->route('variant');

                if ($variant->orders()->exists()) {
                    $validator->errors()->add('order', 'Variant has associated orders.');
                }
            }
        });
    }
}
