<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Http\Requests\Community\StoreCommunityAvatarRequest;
use App\Http\Requests\Community\StoreCommunityRequest;
use App\Http\Requests\Community\StoreCommunityBannerRequest;
use App\Http\Requests\Community\UpdateCommunityRequest;
use App\Models\Community;
use Illuminate\Http\Request;
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

    public function members(Request $request, Community $community)
    {
        $currentUser = auth()->user();

        if ($community->owner()->first()->id != $currentUser->id) {
            return redirect()->back()->with('error', "Вы не являетесь автором сообщества");
        }

        $page = $request->input('page', 1);
        $perPage = 10;

        $members = $community->users()
            ->withPivot(['id'])
            ->paginate($perPage, [
                'users.first_name',
                'users.last_name',
                'users.username',
                'users.birthdate',
                'users.avatar',
                'users.created_at',
                'user_community_roles.id as community_role_id'
            ], 'page', $page);

        if ($request->wantsJson()) {
            return response()->json([
                'members' => $members->items(),
                'hasMore' => $members->hasMorePages(),
            ]);
        }

        return Inertia::render('Communities/Members', [
            'auth' => [
                'user' => $currentUser
            ],
            'profile' => [
                'user' => $currentUser,
                'interests' => $currentUser->interests()->get(),
                'isMyProfile' => $currentUser->id === Auth::id()
            ],
            'community' => [
                'community' => $community,
                'isMyCommunity' => $community->owner()->first()->id === Auth::id(),
                'members' => $members->items()
            ]
        ]);
    }

    public function updateShowMembers(Request $request, Community $community)
    {
        $currentUser = auth()->user();

        if ($community->owner()->first()->id != $currentUser->id) {
            return redirect()->back()->with('error', "Вы не являетесь автором сообщества");
        }

        $validated = $request->validate([
            'show_members' => 'required|boolean'
        ]);

        $community->update($validated);
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

    /**
     * Display the user's profile form.
     */
    public function edit(Community $community)
    {
        $currentUser = auth()->user();
        if ($community->owner()->first()->id != $currentUser->id) {
            return redirect()->back()->with('error', "Вы не являетесь автором сообщества");
        }

        return Inertia::render('Communities/Edit', [
            'auth' => [
                'user' => $currentUser
            ],
            'community' => [
                'community' => $community->makeVisible('created_at_formatted'),
            ]
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(UpdateCommunityRequest $request, Community $community)
    {
        if ($community->exists()) {
            $validated = $request->validated();
            $community->update($validated);
            return redirect()->route('community.edit', ['community' => $community->slug])->with('success', 'Сообщество успешно обновлено');
        } else {
            return redirect()->back()->with('error', "Сообщество не найдено");
        }
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
