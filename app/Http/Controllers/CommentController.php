<?php

namespace App\Http\Controllers;

use App\Http\Requests\Comment\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Number;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $post = Post::where('id', $request->post)->first();
        $page = $request->input('page', 1);
        $perPage = 7;

        $comments = $post->comments()->with('author')
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'comments' => CommentResource::collection($comments),
            'hasMore' => $comments->hasMorePages()
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
    public function store(StoreCommentRequest $storeCommentRequest)
    {
        $validated = $storeCommentRequest->validated();
        $comment = Comment::create($validated);

        return response()->json([
            'message' => 'Вы успешно опубликовали комментарий',
            'comment' => new CommentResource($comment->load('author'))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        //
    }

    public function like(Comment $comment)
    {
        $like = Like::where('owner_id', $comment->id)
            ->where('owner_type', 'comment')
            ->where('user_id', auth()->id())->first();

        if ($like) {
            $like->delete();
            $comment->loadCount('likes');

            return response()->json([
                'is_liked' => false,
                'like_count' => Number::abbreviate($comment->likes_count)
            ]);

        } else {

            Like::create([
                'owner_id' => $comment->id,
                'owner_type' => 'comment',
                'user_id' => auth()->id(),
            ]);

            $comment->loadCount('likes');

            return response()->json([
                'is_liked' => true,
                'like_count' => Number::abbreviate($comment->likes_count)
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        //
    }
}
