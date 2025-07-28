<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\CommunityRole;
use App\Models\User;
use App\Models\UserCommunityRole;
use Illuminate\Auth\Access\Response;

class UserCommunityRolePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserCommunityRole $userCommunityRole): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Community $community)
    {
        $communities = $user->communities()
            ->where('community_role_id', CommunityRole::getFollowerCommunityRoleID())
            ->count();

        $limit = $user->user_feature_subscription->community_subscription_count ?? PHP_INT_MAX;

        if ($communities == $limit) {
            return Response::deny("Лимит подписок: {$user->user_feature_subscription->community_subscription_count} сообществ. Откройте полный доступ с подпиской!", 422);
        }

        $topics = $user->interests()->pluck('topics.id')->toArray();

        if (!in_array($community->topic->id, $topics)) {
            return Response::deny("Вы можете подписаться на сообщества только по своим интересам. Откройте полный доступ с подпиской!", 422);
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserCommunityRole $userCommunityRole): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserCommunityRole $userCommunityRole): bool
    {
        return $userCommunityRole->community()->first()->owner()->first()->id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UserCommunityRole $userCommunityRole): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UserCommunityRole $userCommunityRole): bool
    {
        return false;
    }
}
