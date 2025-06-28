<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserInterestRequest;
use App\Models\Topic;
use Inertia\Inertia;

class UserInterestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('UserInterest/Create', [
            'auth' => [
                'user' => auth()->user()
            ],
            'topics' => [
                'list' => Topic::paginate(10),
                'user_interests' => auth()->user()->interests()->get()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserInterestRequest $storeUserInterestRequest)
    {
        $validated = $storeUserInterestRequest->validated();
        $user = request()->user();
        $currentInterests = $user->interests()->pluck('topics.id')->toArray();
        $maxInterests = $user->user_feature_subscription->user_interest_count ?? 0;

        if ($user->user_feature_subscription->feature_subscription_type == 'free') {
            $newTopics = array_diff($validated['topics'], $currentInterests);

            if (count(array_diff($currentInterests, $validated['topics'])) > 0) {
                return redirect()->back()->with(
                    'error',
                    'Нельзя удалять или заменять выбранные темы в бесплатной подписке. Можно только добавлять новые в пределах лимита!'
                );
            }

            if (count($currentInterests) + count($newTopics) > $maxInterests) {
                return redirect()->back()->with(
                    'error',
                    "Вы можете выбрать не более {$maxInterests} тем. Откройте полный доступ с подпиской!"
                );
            }

            foreach ($newTopics as $topicId) {
                $user->interestsPivots()->create(['user_id' => $user->id, 'topic_id' => $topicId]);
            }
        } else {
            $newTopics = array_diff($validated['topics'], $currentInterests);
            $topicsToRemove = array_diff($currentInterests, $validated['topics']);

            if (!empty($topicsToRemove)) {
                $user->interestsPivots()->whereIn('topic_id', $topicsToRemove)->delete();
            }

            foreach ($newTopics as $topicId) {
                $user->interestsPivots()->firstOrCreate(['user_id' => $user->id, 'topic_id' => $topicId]);
            }
        }

        return redirect()->intended(route('profile.show', ['user' => $user->username]));
    }

    /**
     * Display the specified resource.
     */
    public function show(Topic $topic)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Topic $topic)
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Topic $topic)
    {
        //
    }
}
