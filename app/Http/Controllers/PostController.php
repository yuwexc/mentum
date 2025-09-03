<?php

namespace App\Http\Controllers;

use App\Http\Requests\Post\StorePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Community;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Number;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $input = $request->owner;

        $owner = User::where('username', $input)->first();

        if (!$owner) {
            $owner = Community::where('slug', $input)
                ->orWhere('id', $input)->first();
        }

        $page = $request->input('page', 1);
        $perPage = 5;

        $posts = $owner->posts()
            ->with([
                'owner',
                'comments' => function ($query) {
                    $query->with('author')->latest()->limit(1);
                }
            ])
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'posts' => PostResource::collection($posts),
            'hasMore' => $posts->hasMorePages()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $storePostRequest)
    {
        $validated = $storePostRequest->validated();

        $post = Post::create($validated);

        return response()->json([
            'message' => 'Вы успешно опубликовали пост',
            'post' => new PostResource($post->load([
                'owner',
                'comments' => function ($query) {
                    $query->with('author')->latest()->limit(1);
                }
            ]))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update()
    {
        //
    }

    public function view(Post $post)
    {
        $post->increment('view_count');

        $post->refresh();

        return response()->json([
            'view_count' => Number::abbreviate($post->view_count)
        ]);
    }

    public function archive(Post $post)
    {
        if ($post->trashed()) {
            if (auth()->user()->can('restore', $post)) {
                $post->restore();
            } else {
                return abort(403);
            }
        } elseif (auth()->user()->can('delete', $post)) {
            $post->delete();
        } else {
            return abort(403);
        }
    }

    public function like(Post $post)
    {
        $like = Like::where('owner_id', $post->id)
            ->where('owner_type', 'post')
            ->where('user_id', auth()->id())->first();

        if ($like) {
            $like->delete();
            $post->loadCount('likes');

            return response()->json([
                'is_liked' => false,
                'like_count' => Number::abbreviate($post->likes_count)
            ]);

        } else {

            Like::create([
                'owner_id' => $post->id,
                'owner_type' => 'post',
                'user_id' => auth()->id(),
            ]);

            $post->loadCount('likes');

            return response()->json([
                'is_liked' => true,
                'like_count' => Number::abbreviate($post->likes_count)
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if (auth()->user()->can('forceDelete', $post)) {
            $post->forceDelete();
        } else {
            return abort(403);
        }
    }
}
