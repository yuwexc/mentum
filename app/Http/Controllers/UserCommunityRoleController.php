<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityRole;
use App\Models\UserCommunityRole;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserCommunityRoleController extends Controller
{
    public function index(Request $request, Community $community)
    {
        $page = $request->input('page', 1);
        $perPage = 30;

        $members = $community->users()
            ->paginate($perPage, [
                'users.first_name',
                'users.last_name',
                'users.username',
                'users.birthdate',
                'users.avatar',
                'users.created_at',
            ], 'page', $page);

        return response()->json([
            'members' => $members->items(),
            'hasMore' => $members->hasMorePages()
        ]);
    }

    public function toggle(Community $community)
    {
        $user = auth()->user();

        $isSubscribed = $user->communities()->where('communities.id', $community->id)->exists();

        if ($isSubscribed) {
            $user->communities()->detach($community->id);
        } else {
            $permission = Gate::inspect('create', [UserCommunityRole::class, $community]);
            if ($permission->allowed()) {
                $user->communities()->attach($community->id, [
                    'id' => Str::ulid(),
                    'community_role_id' => CommunityRole::getFollowerCommunityRoleID()
                ]);
            } else {
                return response()->json([
                    'error' => $permission->message()
                ], 422);
            }
        }

        $community->refresh();

        return response()->json([
            'followers_count' => $community->followers_count,
            'is_followed' => $community->is_followed
        ]);
    }

    public function destroy(Request $request)
    {
        $userCommunityRole = UserCommunityRole::find($request->input('id'));

        if (!$userCommunityRole) {
            return back()->with('error', 'Действие невозможно. Повторите позже');
        }

        if (auth()->user()->can('delete', $userCommunityRole)) {
            $userCommunityRole->delete();
            return redirect()->back()->with('success', 'Пользователь успешно удален из списка подписчиков');
        } else {
            return back()->with('error', 'Действие запрещено. Вы не являетесь автором сообщества');
        }
    }
}
