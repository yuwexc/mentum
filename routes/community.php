<?php

use App\Http\Controllers\Community\CommunityController;
use App\Http\Controllers\UserCommunityRoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'mustHaveInterests'])->group(function () {

    Route::get('communities', [CommunityController::class, 'index'])->name('communities');

    Route::get('communities/new', [CommunityController::class, 'create'])->name('communities.create');

    Route::post('communities/new', [CommunityController::class, 'store'])->name('communities.store');

    Route::get('communities/{community}', [CommunityController::class, 'show'])->name('community.show');
    
    Route::post('/communities/{community}/toggle-subscription', [UserCommunityRoleController::class, 'toggle'])
    ->name('community.subscription.toggle');
    
    Route::post('communities/{community}/avatar', [CommunityController::class, 'updateAvatar'])->name('community.update.avatar');
    
    Route::post('communities/{community}/banner', [CommunityController::class, 'updateBanner'])->name('community.update.banner');
    
    Route::delete('communities/{community}/avatar', [CommunityController::class, 'deleteAvatar'])->name('community.avatar.delete');
});