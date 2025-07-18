<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserInterest;
use Illuminate\Auth\Access\Response;

class UserInterestPolicy
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
    public function view(User $user, UserInterest $userInterest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return auth()->id() === $user->id && $user->interests()->count() <= $user->user_feature_subscription->user_interest_count;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserInterest $userInterest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserInterest $userInterest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UserInterest $userInterest): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UserInterest $userInterest): bool
    {
        return false;
    }
}
