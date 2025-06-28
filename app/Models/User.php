<?php

namespace App\Models;

use App\Notifications\VerifyEmailNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasUlids, SoftDeletes, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users';

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
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'avatar',
        'bio',
        'birthdate',
        'website',
        'gender',
        'show_birthdate',
        'google_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'email',
        'password',
        'remember_token',
        'role_id',
        'show_birthdate',
        'google_id',
        'updated_at',
        'deleted_at',
        'pivot'
    ];

    protected $appends = [
        'full_name',
        'user_system_role',
        'user_feature_subscription',
        'birthdate_formatted',
        'created_at_formatted'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birthdate' => 'datetime',
            'show_birthdate' => 'boolean',
            'email_verified_at' => ['datetime', 'nullable']
        ];
    }

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['id', 'username'];
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getBirthdateFormattedAttribute()
    {
        return $this->birthdate->format('d.m.Y');
    }

    public function getUserSystemRoleAttribute()
    {
        return $this->roles()->where('code', 'user')->first();
    }

    public function getUserFeatureSubscriptionAttribute()
    {
        return $this->belongsToMany(
            FeaturesSubscription::class,
            'user_feature_subscriptions',
            'user_id',
            'feature_id'
        )->withPivot(['created_at'])
            ->wherePivot('created_at', '<=', now()->addDays(30))->first();
    }

    public function getCreatedAtFormattedAttribute()
    {
        return $this->created_at->format('d.m.Y');
    }

    /**
     * Retrieve the model for a bound value.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where('username', $value)->firstOrFail();
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailNotification());
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (User $user) {
            if (!empty($user->password)) {
                $user->password = Hash::make($user->password);
            }
        });

        static::created(function (User $user) {
            UserSystemRole::create([
                'user_id' => $user->id,
                'role_id' => Role::defaultRoleID()
            ]);

            UserFeatureSubscription::create([
                'user_id' => $user->id,
                'feature_id' => FeaturesSubscription::defaultFeatureSubscriptionID()
            ]);
        });

        static::updating(function (User $user) {
            if ($user->isDirty('password')) {
                $user->password = Hash::make($user->password);
            }

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
                $user->sendEmailVerificationNotification();
            }
        });
    }

    public static function createOrRestore(array $data): User
    {
        $user = self::withTrashed()->where('email', $data['email'])->first();

        if ($user) {
            if ($user->trashed()) {
                $user->restore();
            }

            $user->update($data);

            return $user;
        }

        return self::create($data);
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            Role::class,
            'user_system_roles',
            'user_id',
            'role_id'
        );
    }

    public function isAdmin(): bool
    {
        if (!$this->relationLoaded('roles')) {
            $this->load('roles');
        }

        return $this->roles->contains('code', 'admin');
    }

    public function interestsPivots(): HasOne
    {
        return $this->hasOne(UserInterest::class);
    }

    public function interests(): BelongsToMany
    {
        return $this->belongsToMany(
            Topic::class,
            'user_interests',
            'user_id',
            'topic_id'
        );
    }

    public function getCommunityRecommendationsByUserInterests()
    {
        return Community::whereIn('topic_id', $this->interests()->pluck('topics.id'))
            ->get()
            ->sortByDesc('followers_count');
    }

    public function communities(): BelongsToMany
    {
        return $this->belongsToMany(
            Community::class,
            'user_community_roles',
            'user_id',
            'community_id'
        );
    }

    public function ownCommunities(): BelongsToMany
    {
        $ownerRoleId = CommunityRole::where('code', 'owner')->value('id');

        return $this->communities()->wherePivot('community_role_id', $ownerRoleId);
    }
}
