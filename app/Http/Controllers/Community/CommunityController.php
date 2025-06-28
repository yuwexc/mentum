<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Http\Requests\Community\StoreCommunityAvatarRequest;
use App\Http\Requests\Community\StoreCommunityRequest;
use App\Http\Requests\Community\StoreCommunityBannerRequest;
use App\Models\Community;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CommunityController extends Controller
{
    public function index()
    {
        $currentUser = auth()->user();
        return Inertia::render('Communities/Index', [
            'auth' => [
                'user' => $currentUser
            ],
            'profile' => [
                'user' => $currentUser,
                'interests' => $currentUser->interests()->get(),
                'isMyProfile' => $currentUser->id === Auth::id()
            ],
            'communities' => $currentUser->getCommunityRecommendationsByUserInterests()
        ]);
    }

    public function show(Community $community)
    {
        $currentUser = auth()->user();
        return Inertia::render('Communities/Show', [
            'auth' => [
                'user' => $currentUser
            ],
            'profile' => [
                'user' => $currentUser,
                'interests' => $currentUser->interests()->get(),
                'isMyProfile' => $currentUser->id === Auth::id()
            ],
            'community' => [
                'community' => $community->makeVisible('created_at_formatted'),
                'isMyCommunity' => $community->owner()->first()->id === Auth::id()
            ]
        ]);
    }

    public function create()
    {
        $currentUser = auth()->user();
        $interests = $currentUser->interests()->get();

        return Inertia::render('Communities/Create', [
            'auth' => [
                'user' => $currentUser
            ],
            'profile' => [
                'user' => $currentUser,
                'interests' => $interests,
                'isMyProfile' => $currentUser->id === Auth::id()
            ],
            'topicsList' => $interests
        ]);
    }

    public function store(StoreCommunityRequest $storeCommunityRequest)
    {
        $validated = $storeCommunityRequest->validated();

        $extension = $validated['avatar']->extension();
        $filename = now()->timestamp . '_' . Str::random(20) . '.' . $extension;
        $path = $validated['avatar']->storeAs('avatars', $filename);
        $validated['avatar'] = '/storage/' . $path;

        $community = Community::create($validated);

        return redirect()->route('community.show', ['community' => $community->slug ?: $community->id])->with('success', 'Вы успешно создали сообщество "' . $community->name . '"');
    }

    public function updateAvatar(StoreCommunityAvatarRequest $storeCommunityAvatarRequest, Community $community)
    {
        $validated = $storeCommunityAvatarRequest->validated();

        $extension = $validated['avatar']->extension();
        $filename = now()->timestamp . '_' . Str::random(20) . '.' . $extension;
        $path = $validated['avatar']->storeAs('avatars', $filename);

        if ($community->avatar) {
            $oldPath = str_replace('/storage', 'public', $community->avatar);
            Storage::delete($oldPath);
        }

        $community->avatar = '/storage/' . $path;
        $community->save();
    }

    public function updateBanner(StoreCommunityBannerRequest $storeCommunityBannerRequest, Community $community)
    {
        $validated = $storeCommunityBannerRequest->validated();

        $extension = $validated['banner']->extension();
        $filename = now()->timestamp . '_' . Str::random(20) . '.' . $extension;
        $path = $validated['banner']->storeAs('banners', $filename);

        if ($community->banner) {
            $oldPath = str_replace('/storage', 'public', $community->banner);
            Storage::delete($oldPath);
        }

        $community->banner = '/storage/' . $path;
        $community->save();
    }

    public function deleteAvatar(Community $community)
    {
        if (!$community->avatar) {
            return redirect()->back()->with('error', 'Аватар уже отсутствует');
        }

        $path = str_replace('/storage', 'public', $community->avatar);

        if (Storage::exists($path)) {
            Storage::delete($path);
        }

        $community->avatar = null;
        $community->save();

        return redirect()->back()->with('success', 'Аватар успешно удален');
    }
}
