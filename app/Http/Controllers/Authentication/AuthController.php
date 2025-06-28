<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Http\Requests\Authentication\AuthRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    public function store(AuthRequest $authRequest)
    {
        try {
            $authRequest->authenticate();

            $authRequest->session()->regenerate();

            return redirect()->intended(route('feed'));

        } catch (ValidationException $e) {
            Log::warning('Login failed for: ' . $authRequest->email, [
                'ip' => $authRequest->ip(),
                'errors' => $e->errors()
            ]);

            return back()->withErrors($e->errors());
        }
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect(route('home'));
    }
}
