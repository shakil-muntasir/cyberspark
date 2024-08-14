<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response as InertiaResponse;

class UserController extends Controller
{
    public function index(UserRequest $request): InertiaResponse
    {
        $users = User::filterAndSort($request->validatedParams());

        return inertia('User/Index', [
            'users' => UserResource::collection($users),
        ]);
    }

    public function store(): RedirectResponse
    {
        return redirect()->back();
    }
}
