<?php

namespace App\Http\Controllers;

use App\Http\Requests\Post\StorePostRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = User::where('username', $request->username)->first();
        $page = $request->input('page', 1);
        $perPage = 20;

        $posts = $user->posts()->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response([
            'posts' => $posts->items(),
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
        return redirect()->back()->with('success', 'Вы успешно опубликовали пост');
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
