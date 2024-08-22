<?php

namespace App\Http\Requests;

use App\Enums\Gender;
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
            'gender' => ['required', 'string', Rule::enum(Gender::class)],
            'phone' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
            'password' => ['required', 'string', 'min:8'],
            'roles' => ['array', 'exists:roles,name', 'min:1'],
            'address.street' => ['required', 'string', 'max:255'],
            'address.city' => ['required', 'string', 'max:255'],
            'address.state' => ['required', 'string', 'max:255'],
            'address.zip' => ['required', 'string', 'max:20'],
        ];
    }

    public function messages()
{
    return [
        'address.street.required' => 'The street field is required.',
        'address.street.max' => 'The street field must not be greater than 255 characters.',
        'address.city.required' => 'The city field is required.',
        'address.city.max' => 'The city field must not be greater than 255 characters.',
        'address.state.required' => 'The state field is required.',
        'address.state.max' => 'The state field must not be greater than 255 characters.',
        'address.zip.required' => 'The zip field is required.',
        'address.zip.max' => 'The zip field must not be greater than 20 characters.',
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
