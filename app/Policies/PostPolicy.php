<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
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
    public function view(User $user, Post $post): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return auth()->id() === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Post $post): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Post $post): bool
    {
        if ($post->owner_type == 'user') {
            return $user->id === $post->owner_id;
        }

        if ($post->owner_type == 'community') {
            $community = Community::find($post->owner_id);
            return $user->id === $community->owner()->first()->id;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Post $post): bool
    {
        if ($post->owner_type == 'user') {
            return $user->id === $post->owner_id;
        }

        if ($post->owner_type == 'community') {
            $community = Community::find($post->owner_id);
            return $user->id === $community->owner()->first()->id;
        }

        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Post $post): bool
    {
        if ($post->owner_type == 'user') {
            return $user->id === $post->owner_id;
        }

        if ($post->owner_type == 'community') {
            $community = Community::find($post->owner_id);
            return $user->id === $community->owner()->first()->id;
        }

        return false;
    }
}
