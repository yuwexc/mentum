<?php

namespace App\Http\Controllers;

use App\Models\InteractionStatus;
use App\Models\User;
use App\Models\UserInteraction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserInteractionController extends Controller
{
    public function toggle(Request $request)
    {
        $user = auth()->user();

        $interactedUser = User::where('username', $request->input('username'))->firstOrFail();

        if ($user->id === $interactedUser->id) {
            return response()->json([
                'error' => 'Нельзя подписаться на самого себя'
            ], 422);
        }

        $isSubscribed = UserInteraction::where(function ($query) use ($interactedUser) {
            $query->where('interacted_user', $interactedUser->id)
                ->orWhere('user_id', $interactedUser->id);
        })
            ->where(
                function ($query) {
                    $query->where('interacted_user', auth()->id())
                        ->orWhere('user_id', auth()->id());
                }
            )
            ->whereNot('interaction_status_id', InteractionStatus::getBannedInteractionStatusID());

        if ($isSubscribed->exists()) {
            $isSubscribed->delete();

            return response()->json([
                'interaction_status' => null,
                'interactions' => [
                    'friends' => [
                        'list' => $interactedUser->friends()->take(5),
                        'hasMore' => $interactedUser->friends()->count() > 5
                    ],
                    'requests' => $interactedUser->requests()->get()->map(function (UserInteraction $interaction): array {
                        return [
                            'id' => $interaction->id,
                            'user' => $interaction->user->makeHidden(['user_feature_subscription', 'user_system_role'])
                        ];
                    }),
                ],
            ]);

        } else {
            if ($user->can('create', [UserInteraction::class, $interactedUser])) {
                $interaction_status = InteractionStatus::getRequestedInteractionStatusID();
                $ulid = Str::ulid();
                $user->interactions()->attach($interactedUser->id, [
                    'id' => $ulid,
                    'interaction_status_id' => $interaction_status,
                    'initiator_id' => auth()->id()
                ]);

                return response()->json([
                    'interaction_status' => [
                        'id' => $ulid,
                        'code' => InteractionStatus::find($interaction_status)->code,
                        'initiator_id' => auth()->id()
                    ],
                    'interactions' => [
                        'friends' => [
                            'list' => $interactedUser->friends()->take(5),
                            'hasMore' => $interactedUser->friends()->count() > 5
                        ],
                        'requests' => $interactedUser->requests()->get()->map(function (UserInteraction $interaction): array {
                            return [
                                'id' => $interaction->id,
                                'user' => $interaction->user->makeHidden(['user_feature_subscription', 'user_system_role'])
                            ];
                        }),
                    ],
                ]);

            } else {
                return response()->json([
                    'error' => "Лимит подписок: {$user->user_feature_subscription->user_subscription_count} пользователей. Откройте полный доступ с подпиской!"
                ], 422);
            }
        }
    }

    public function accept(Request $request)
    {
        $interaction = UserInteraction::findOrFail($request->input('id'));

        $user = auth()->user();

        if ($user->can('update', $interaction)) {
            $interaction->interaction_status_id = InteractionStatus::getFollowedInteractionStatusID();
            $interaction->save();

            return response()->json([
                'interaction_status' => [
                    'id' => $interaction->id,
                    'code' => InteractionStatus::find($interaction->interaction_status_id)->code,
                    'initiator_id' => $interaction->initiator_id
                ],
                'interactions' => [
                    'friends' => [
                        'list' => $interaction->user()->first()->friends()->take(5),
                        'hasMore' => $interaction->user()->first()->friends()->count() > 5
                    ],
                    'requests' => [],
                ],
            ]);
        } else {
            return response()->json([
                'error' => "Лимит подписок: {$user->user_feature_subscription->user_subscription_count} пользователей. Откройте полный доступ с подпиской!"
            ], 422);
        }
    }

    public function friends(Request $request)
    {
        $validated = $request->validate([
            'user' => 'nullable|string|max:255'
        ]);

        $username = $validated['user'] ?? auth()->user()->username;

        $user = User::where('username', $username)->first();

        if ($user) {

            if ($request->wantsJson()) {

                $friendsQuery = null;

                if (
                    UserInteraction::where('interaction_status_id', InteractionStatus::getFollowedInteractionStatusID())
                        ->where('interacted_user', $user->id)
                        ->exists()
                ) {
                    $query1 = $user->interactionsReturned()
                        ->wherePivot('interaction_status_id', InteractionStatus::getFollowedInteractionStatusID())
                        ->wherePivot('interacted_user', $user->id)
                        ->select('users.*');

                    $friendsQuery = $query1;
                }

                if (
                    UserInteraction::where('interaction_status_id', InteractionStatus::getFollowedInteractionStatusID())
                        ->where('user_id', $user->id)
                        ->exists()
                ) {
                    $query2 = $user->interactions()
                        ->wherePivot('interaction_status_id', InteractionStatus::getFollowedInteractionStatusID())
                        ->wherePivot('user_id', $user->id)
                        ->select('users.*');

                    $friendsQuery = $friendsQuery
                        ? $friendsQuery->toBase()->union($query2->toBase())
                        : $query2->toBase();
                }

                if ($friendsQuery) {
                    $perPage = 15;
                    $page = $request->input('page', 1);

                    $friends = $friendsQuery->paginate($perPage, ['*'], 'page', $page);

                    $friends->getCollection()->transform(function ($item) {
                        unset($item->user_system_role, $item->user_feature_subscription);
                        $item->full_name = $item->first_name . ' ' . $item->last_name;
                        return $item;
                    });
                } else {
                    $friends = collect([]);
                }

                return response()->json([
                    'friends' => [
                        'list' => $friends->items(),
                        'hasMore' => $friends->hasMorePages(),
                    ]
                ]);
            }
        } else {
            return redirect()->back()->with('error', 'Ошибка. Такого пользователя не существует');
        }

        return Inertia::render('Friends/Show', [
            'auth' => [
                'user' => auth()->user()
            ],
            'profile' => [
                'user' => auth()->user(),
                'interests' => auth()->user()->interests()->get(),
                'isMyProfile' => auth()->id() === Auth::id()
            ],
            'friends' => [
                'list' => $user->friends()->take(15),
                'user' => $user,
            ]
        ]);
    }
}
