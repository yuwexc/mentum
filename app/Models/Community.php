<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Number;

class Community extends Model
{
    use HasUlids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'communities';

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
        'name',
        'slug',
        'description',
        'avatar',
        'banner',
        'topic_id',
        'email',
        'website',
        'show_members'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'pivot',
        'topic_id',
        'created_at',
        'created_at_formatted',
        'updated_at',
        'deleted_at'
    ];

    protected $appends = [
        'topic',
        'owner',
        'followers_count',
        'is_followed',
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
            'show_members' => 'boolean'
        ];
    }

    public function getTopicAttribute(): Topic
    {
        return $this->belongsTo(Topic::class, 'topic_id', 'id')->first();
    }

    public function getOwnerAttribute()
    {
        return $this->owner()->first()->username;
    }

    public function getFollowersCountAttribute()
    {
        return Number::abbreviate($this->users()->count());
    }

    public function getIsFollowedAttribute(): bool
    {
        return $this->users()->where('users.id', auth()->id())->exists();
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
        return $this->where('slug', $value)->orWhere('id', $value)->firstOrFail();
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function (Community $community) {
            UserCommunityRole::create([
                'user_id' => auth()->id(),
                'community_id' => $community->id,
                'community_role_id' => CommunityRole::defaultCommunityRoleID()
            ]);
        });
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'user_community_roles',
            'community_id',
            'user_id'
        );
    }

    public function owner(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'user_community_roles',
            'community_id',
            'user_id'
        )->wherePivot('community_role_id', CommunityRole::defaultCommunityRoleID());
    }
}
