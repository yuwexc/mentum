<?php

namespace App\Providers;

use App\Models\Community;
use App\Models\User;
use App\Models\Role;
use App\Models\UserCommunityRole;
use App\Models\UserInterest;
use App\Models\UserSystemRole;
use App\Policies\CommunityPolicy;
use App\Policies\RolePolicy;
use App\Policies\UserCommunityRolePolicy;
use App\Policies\UserInterestPolicy;
use App\Policies\UserPolicy;
use App\Policies\UserSystemRolePolicy;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Role::class => RolePolicy::class,
        UserSystemRole::class => UserSystemRolePolicy::class,
        UserInterest::class => UserInterestPolicy::class,
        Community::class => CommunityPolicy::class,
        UserCommunityRole::class => UserCommunityRolePolicy::class
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
