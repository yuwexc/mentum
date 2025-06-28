<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('Profile/Index', [
            'auth' => [
                'user' => auth()->user()
            ],
            'profile' => [
                'user' => $user->makeVisible('show_birthdate'),
                'interests' => $user->interests()->get(),
                'isMyProfile' => auth()->id() === $user->id
            ],
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'auth' => [
                'user' => auth()->user()->makeVisible('email')
            ]
            // 'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            // 'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        if ($user->exists()) {
            $validated = $request->validated();
            $user->update($validated);
            return back()->with('success', 'Профиль успешно обновлен');
        } else {
            return redirect()->back()->with('error', "Не найден пользователь");
        }
    }

    public function complete()
    {
        $google_user = session('google_user_data');

        if (!$google_user) {
            return redirect(route('login'));
        }

        return Inertia::render('Profile/Complete', [
            'google_user' => $google_user
        ]);
    }

    public function privacy(Request $request)
    {
        return Inertia::render('Profile/Privacy', [
            'auth' => [
                'user' => auth()->user()->makeVisible('show_birthdate')
            ]
            // 'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            // 'status' => session('status'),
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
