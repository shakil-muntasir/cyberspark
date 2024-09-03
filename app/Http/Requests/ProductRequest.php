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
        if ($this->isMethod('get')) {
            // No validation for GET requests
            return [];
        }

        return [
            'name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
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
            'active' => filter_var($this->query('active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'inactive' => filter_var($this->query('inactive'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'sort_by' => $this->query('sortBy', null),
            'sort_to' => $this->query('sortTo', null),
            'per_page' => (int) $this->query('per_page', 10),
        ];
    }
}
