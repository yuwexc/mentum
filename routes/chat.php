<?php

use App\Http\Controllers\ChatController;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/chats', [ChatController::class, 'index'])->name('chats');

});