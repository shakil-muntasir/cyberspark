<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($this->user)],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
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
            'sort_by' => $this->query('sortBy', 'id'),
            'sort_to' => $this->query('sortTo', 'asc'),
            'per_page' => (int) $this->query('per_page', 10),
        ];
    }
}
