<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response as InertiaResponse;

class UserController extends Controller
{
    public function index(): InertiaResponse
    {
        return inertia('User/Index', [
            'users' => User::paginate(10),
        ]);
    }

    public function store(): RedirectResponse
    {
        return redirect()->back();
    }
}
