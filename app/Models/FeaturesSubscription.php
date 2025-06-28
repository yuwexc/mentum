<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeaturesSubscription extends Model
{
    use HasUlids, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'features_subscriptions';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'feature_subscription_type',
        'user_interest_count',
        'community_subscription_count',
        'community_ownership_count',
        'user_subscription_count',
        'can_subscribe_any_user'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
        'pivot'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'can_subscribe_any_user' => 'boolean'
        ];
    }

    public static function defaultFeatureSubscriptionID(): string
    {
        return cache()->remember('default_user_feature_subscription_id', 3600, function () {
            return FeaturesSubscription::firstOrCreate(
                ['feature_subscription_type' => 'free'],
                [
                    'user_interest_count' => 3,
                    'community_subscription_count' => 5,
                    'community_ownership_count' => 1,
                    'user_subscription_count' => 10,
                    'can_subscribe_any_user' => false
                ]
            )->id;
        });
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'user_feature_subscriptions',
            'role_id',
            'feature_id'
        );
    }
}
