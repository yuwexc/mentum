<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UpdateUserRequest;
use App\Models\CommunityRole;
use App\Models\InteractionStatus;
use App\Models\User;
use App\Models\UserInteraction;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $followings = $user->communities()->select(['communities.id', 'slug', 'name', 'communities.avatar', 'topic_id'])
            ->get()->each(function ($community) {
                $community->is_common_community = auth()->user()
                    ->communities()
                    ->where('communities.id', $community->id)
                    ->wherePivot('community_role_id', '<>', CommunityRole::defaultCommunityRoleID())
                    ->exists();
            });

        if (!$user->show_birthdate) {
            $user->makeHidden('birthdate');
        }

        return Inertia::render('Profile/Index', [
            'auth' => [
                'user' => auth()->user()
            ],
            'profile' => [
                'user' => $user->makeVisible('show_birthdate'),
                'interests' => $user->interests()->get(),
                'isMyProfile' => auth()->id() === $user->id,
                'followings' => [
                    'list' => $followings->take(3)
                        ->makeHidden(['owner', 'followers_count', 'is_followed']),
                    'hasMore' => $followings->count() > 3
                ],
                'interaction_status' => auth()->user()->interactionStatus($user),
                'interactions' => [
                    'friends' => [
                        'list' => $user->friends()->take(5),
                        'hasMore' => $user->friends()->count() > 5
                    ],
                    'requests' => $user->requests()->get()->map(function (UserInteraction $interaction): array {
                        return [
                            'id' => $interaction->id,
                            'user' => $interaction->user->makeHidden(['user_feature_subscription', 'user_system_role'])
                        ];
                    }),
                ],
                'posts' => [
                    'list' => $user->posts()->get()->sortByDesc('created_at')->values()->take(20)
                ]
            ]
        ]);
    }

    public function following(Request $request, User $user)
    {
        $page = $request->input('page', 1);
        $perPage = 10;

        $communities = $user->communities()
            ->withPivot(['id'])
            ->paginate($perPage, [
                'communities.id',
                'slug',
                'name',
                'avatar',
                'topic_id'
            ], 'page', $page);

        return response()->json([
            'communities' => $communities->items(),
            'hasMore' => $communities->hasMorePages(),
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'auth' => [
                'user' => auth()->user()->makeVisible('email')
            ]
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        if ($user->exists()) {
            $validated = $request->validated();
            $user->update($validated);
            return back()->with('success', 'Профиль успешно обновлен');
        } else {
            return redirect()->back()->with('error', "Не найден пользователь");
        }
    }

    public function complete()
    {
        $google_user = session('google_user_data');

        if (!$google_user) {
            return redirect(route('login'));
        }

        return Inertia::render('Profile/Complete', [
            'google_user' => $google_user
        ]);
    }

    public function privacy(Request $request)
    {
        return Inertia::render('Profile/Privacy', [
            'auth' => [
                'user' => auth()->user()->makeVisible('show_birthdate')
            ]
            // 'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            // 'status' => session('status'),
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
