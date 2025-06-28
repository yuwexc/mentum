<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'mustHaveInterests'])->group(function () {
    Route::get('/feed', function () {
        $currentUser = Auth::user();
        return Inertia::render('Feed/Index', [
            'auth' => ['user' => $currentUser],
            'profile' => [
                'user' => $currentUser,
                'interests' => $currentUser->interests()->get(),
                'isMyProfile' => $currentUser->id === Auth::id()
            ],
        ]);
    })->name('feed');

    Route::get('/subscriptions', function () {
        return Inertia::render('Subscriptions');
    })->name('subscriptions');

    Route::get('/articles', function () {
        return Inertia::render('Articles');
    })->name('articles');

    Route::get('/challenges', function () {
        return Inertia::render('Challenges');
    })->name('challenges');
});

// Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
//     Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
//     Route::post('/users', [UserController::class, 'store'])->name('users.store');
// });

require __DIR__ . '/auth.php';
require __DIR__ . '/user.php';
require __DIR__ . '/community.php';
