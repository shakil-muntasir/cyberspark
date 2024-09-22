<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCollection;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function dropdown(): UserCollection
    {
        $search = request()->input('search');

        // TODO: revisit and take closer look into this query later.
        $users = User::with(['address'])->role('customer')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%");
            })
            ->latest('id')
            ->take(10)
            ->get();

        return new UserCollection($users);
    }
}
