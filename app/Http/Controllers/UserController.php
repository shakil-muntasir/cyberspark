<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response as InertiaResponse;

class UserController extends Controller
{
    public function index(UserRequest $request): InertiaResponse
    {
        Gate::authorize('viewAny', User::class);

        $users = User::filterAndSort($request->validatedParams());

        return inertia('User/Index', [
            'users' => UserResource::collection($users),
        ]);
    }

    public function store(): RedirectResponse
    {
        return redirect()->back();
    }

    public function show(User $user): InertiaResponse
    {
        Gate::authorize('view', $user);

        $user->load([
            'address',
            'roles',
            'creator:id,name',
        ]);

        return inertia('User/Show', [
            'user' => new UserResource($user),
        ]);
    }
}
