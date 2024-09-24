<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
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
        $IGNORED_METHODS = ['get', 'delete'];
        if (in_array(strtolower($this->method()), $IGNORED_METHODS)) {
            // No validation for ignored request methods
            return [];
        }

        return [
            'name' => 'required|string',
            'sku_prefix' => [
                'required',
                'string',
                Rule::unique('products', 'sku_prefix')->ignore($this->route('product')),
            ],
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Select a category.',
            'category_id.exists' => 'The selected category is invalid.',
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
                $product = $this->route('product');

                if ($product->orders()->exists()) {
                    $validator->errors()->add('order', 'Product has associated orders.');
                }

                if ($product->variants()->exists()) {
                    $validator->errors()->add('variant', 'Product has associated variants.');
                }
            }
        });
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
            'active' => filter_var($this->query('active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'inactive' => filter_var($this->query('inactive'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'sort_by' => $this->query('sortBy', null),
            'sort_to' => $this->query('sortTo', null),
            'per_page' => (int) $this->query('per_page', 10),
        ];
    }
}
