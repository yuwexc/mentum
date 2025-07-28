<?php

namespace App\Policies;

use App\Models\InteractionStatus;
use App\Models\User;
use App\Models\UserInteraction;
use Illuminate\Auth\Access\Response;

class UserInteractionPolicy
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
    public function view(User $user, UserInteraction $userInteraction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, User $interactedUser): bool
    {
        $friends = $user->friends()
            ->where('interaction_status_id', InteractionStatus::getFollowedInteractionStatusID())
            ->count();

        $limit = $user->user_feature_subscription->user_subscription_count ?? PHP_INT_MAX;

        $common_interests = array_intersect(
            auth()->user()->interests()->pluck('topics.id')->toArray(),
            $interactedUser->interests()->pluck('topics.id')->toArray()
        );

        if ($friends == $limit || empty($common_interests)) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserInteraction $userInteraction): bool
    {
        $friends = $user->friends()
            ->where('interaction_status_id', InteractionStatus::getFollowedInteractionStatusID())
            ->count();

        $limit = $user->user_feature_subscription->user_subscription_count ?? PHP_INT_MAX;

        if ($friends == $limit) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserInteraction $userInteraction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UserInteraction $userInteraction): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UserInteraction $userInteraction): bool
    {
        return false;
    }
}
