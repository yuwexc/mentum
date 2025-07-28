<?php

use App\Http\Controllers\PostController;


Route::middleware(['auth', 'verified', 'mustHaveInterests'])->group(function () {

    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');

    Route::post('/post', [PostController::class, 'store'])->name('post.store');

    Route::post('/posts/{post}/view', [PostController::class, 'view'])
        ->name('posts.view');

});