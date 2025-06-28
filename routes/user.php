<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserFeatureSubscriptionController;
use App\Http\Controllers\UserInterestController;
use Illuminate\Support\Facades\Redirect;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/banner', [UserController::class, 'updateBanner'])->name('user.banner');
    Route::post('/avatar', [UserController::class, 'updateAvatar'])->name('user.avatar');
    Route::delete('/avatar', [UserController::class, 'deleteAvatar'])->name('user.avatar.delete');

    Route::get('/@{user}', [ProfileController::class, 'show'])
        ->name('profile.show')
        ->missing(function () {
            return Redirect::route('home');
        });

    Route::post('/@{user}', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/edit', [ProfileController::class, 'edit'])->name('profile.edit');

    Route::get('/privacy', [ProfileController::class, 'privacy'])->name('profile.privacy');

    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/topics', [UserInterestController::class, 'create'])->name('user.interests.create');

    Route::post('/topics', [UserInterestController::class, 'store'])->name('user.interests.store');

    Route::get('/upgrade', [UserFeatureSubscriptionController::class, 'create'])
        ->name('feature.subscription.create');

});