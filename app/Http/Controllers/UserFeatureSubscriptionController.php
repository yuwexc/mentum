<?php

namespace App\Http\Controllers;

use App\Models\FeaturesSubscription;
use App\Models\UserFeatureSubscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserFeatureSubscriptionController extends Controller
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
        return Inertia::render('UserFeatureSubscription/Create', [
            'auth' => [
                'user' => auth()->user()
            ],
            'features_subscriptions' => FeaturesSubscription::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UserFeatureSubscription $userFeatureSubscription)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserFeatureSubscription $userFeatureSubscription)
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
    public function destroy(UserFeatureSubscription $userFeatureSubscription)
    {
        //
    }
}
