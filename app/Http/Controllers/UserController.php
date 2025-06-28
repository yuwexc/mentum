<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\AvatarPostRequest;
use App\Http\Requests\User\BannerPostRequest;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //
    }

    public function updateAvatar(AvatarPostRequest $avatarPostRequest)
    {
        $validated = $avatarPostRequest->validated();

        $extension = $validated['avatar']->extension();
        $filename = now()->timestamp . '_' . Str::random(20) . '.' . $extension;
        $path = $validated['avatar']->storeAs('avatars', $filename);
        $user = Auth::user();

        if ($user->avatar) {
            $oldPath = str_replace('/storage', 'public', $user->avatar);
            Storage::delete($oldPath);
        }

        $user->avatar = '/storage/' . $path;
        $user->save();
    }

    public function deleteAvatar()
    {
        $user = Auth::user();

        if (!$user->avatar) {
            return redirect()->back()->with('error', 'Аватар уже отсутствует');
        }

        $path = str_replace('/storage', 'public', $user->avatar);

        if (Storage::exists($path)) {
            Storage::delete($path);
        }

        $user->avatar = null;
        $user->save();

        return redirect()->back()->with('success', 'Аватар успешно удален');
    }

    public function updateBanner(BannerPostRequest $bannerPostRequest)
    {
        $validated = $bannerPostRequest->validated();

        $extension = $validated['banner']->extension();
        $filename = now()->timestamp . '_' . Str::random(20) . '.' . $extension;
        $path = $validated['banner']->storeAs('banners', $filename);
        $user = Auth::user();

        if ($user->banner) {
            $oldPath = str_replace('/storage', 'public', $user->banner);
            Storage::delete($oldPath);
        }

        $user->banner = '/storage/' . $path;
        $user->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
