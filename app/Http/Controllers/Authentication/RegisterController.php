<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Http\Requests\Authentication\StoreRegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(StoreRegisterRequest $storeRegisterRequest)
    {
        $data = $storeRegisterRequest->validated();
        $user = User::createOrRestore($data);
        event(new Registered($user));
        Auth::login($user);
        return redirect()->route('verification.notice');
    }
}
