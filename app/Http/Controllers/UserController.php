<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response as InertiaResponse;

class UserController extends Controller
{
    public function index(): InertiaResponse
    {
        $searchWith = request()->query('search', '');
        $active = filter_var(request()->query('active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        $inactive = filter_var(request()->query('inactive'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        $sortBy = request()->query('sortBy', 'id');
        $sortTo = request()->query('sortTo', 'asc');
        $paginate = (int) request()->input('per_page', 10);

        $users = User::search($searchWith)
            ->when($active, fn ($q) => $q->active())
            ->when($inactive, fn ($q) => $q->inactive())
            ->orderBy($sortBy, $sortTo)
            ->paginate($paginate);

        return inertia('User/Index', [
            'users' => UserResource::collection($users),
        ]);
    }

    public function store(): RedirectResponse
    {
        return redirect()->back();
    }
}
