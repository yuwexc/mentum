<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;


Route::middleware(['auth', 'verified', 'mustHaveInterests'])->group(function () {

    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');

    Route::post('/post', [PostController::class, 'store'])->name('post.store');

    Route::post('/posts/{post}/view', [PostController::class, 'view'])
        ->name('posts.view');

    Route::post('/posts/{post}/archive', [PostController::class, 'archive'])->name('post.archive');

    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('post.destroy');

    Route::get('/posts/{post}/comment', [CommentController::class, 'index'])->name('post.comment.index');

    Route::post('/posts/{post}/comment', [CommentController::class, 'store'])->name('post.comment.store');

    Route::post('/posts/{post}/like', [PostController::class, 'like'])->name('post.like');

    Route::post('/comment/{comment}/like', [CommentController::class, 'like'])->name('comment.like');

});