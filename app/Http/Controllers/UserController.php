<?php

namespace App\Http\Controllers;

use App\Enums\Gender;
use App\Enums\State;
use App\Enums\UserStatus;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Response as InertiaResponse;

class UserController extends Controller
{
    public function index(UserRequest $request): InertiaResponse
    {
        Gate::authorize('viewAny', User::class);

        $users = User::filterAndSort($request->validatedParams());

        return inertia('User/Index', [
            'genders' => Gender::getAllOptions(),
            'roles' => Role::getAllOptions(),
            'states' => State::getAllOptions(),
            'users' => new UserCollection($users)
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        Gate::authorize('create', User::class);

        DB::transaction(function () use ($request) {
            $user = User::create($request->validated());
            $user->syncRoles($request->roles);
            $user->address()->create($request->address);
        });

        return redirect()->back();
    }

    public function show(User $user): InertiaResponse
    {
        Gate::authorize('view', $user);

        $user->load(['address', 'roles']);

        return inertia('User/Show', [
            'user' => new UserResource($user),
            'genders' => Gender::getAllOptions(),
            'roles' => Role::getAllOptions(),
            'states' => State::getAllOptions(),
            'statuses' => UserStatus::getAllOptions(),
        ]);
    }

    public function customersDropdown(): UserCollection
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
