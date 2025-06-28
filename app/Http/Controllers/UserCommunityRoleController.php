<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityRole;
use Illuminate\Support\Str;

class UserCommunityRoleController extends Controller
{
    public function toggle(Community $community)
    {
        $user = auth()->user();

        $isSubscribed = $user->communities()->where('communities.id', $community->id)->exists();

        if ($isSubscribed) {
            $user->communities()->detach($community->id);
        } else {
            $user->communities()->attach($community->id, [
                'id' => Str::ulid(),
                'community_role_id' => CommunityRole::getFollowerCommunityRoleID()
            ]);
        }

        return response()->json([
            'followers_count' => $community->followers_count,
            'is_followed' => $community->is_followed
        ]);
    }
}
