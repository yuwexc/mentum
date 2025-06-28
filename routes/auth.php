<?php

use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;

use App\Http\Controllers\Authentication\AuthController;
use App\Http\Controllers\Authentication\RegisterController;
use App\Http\Controllers\Authentication\EmailVerificationPromptController;
use App\Http\Controllers\Authentication\EmailVerificationNotificationController;
use App\Http\Controllers\Authentication\SocialLoginController;
use App\Http\Controllers\Authentication\VerifyEmailController;
use App\Http\Controllers\Authentication\PasswordResetLinkController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {

    Route::get('signup', [RegisterController::class, 'create'])->name('signup');

    Route::post('signup', [RegisterController::class, 'store'])->name('signup.store');
    
    Route::get('login', [AuthController::class, 'create'])->name('login');
    
    Route::post('login', [AuthController::class, 'store']);
    
    Route::get('auth/google', [SocialLoginController::class, 'redirectToGoogle']);
    
    Route::get('auth/google/callback', [SocialLoginController::class, 'handleGoogleCallback']);
    
    Route::get('complete', [ProfileController::class, 'complete'])->name('profile.complete');



    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');



    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthController::class, 'destroy'])->name('logout');
});
