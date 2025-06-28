<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class CommunityRole extends Model
{
    use HasUlids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'community_roles';

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
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'id',
        'pivot'
    ];

    public static function defaultCommunityRoleID(): string
    {
        return cache()->remember('default_community_role_id', 3600, function () {
            return CommunityRole::firstOrCreate(['code' => 'owner'], ['name' => 'Владелец'])->id;
        });
    }

    public static function getFollowerCommunityRoleID(): string
    {
        return cache()->remember('follower_community_role_id', 3600, function () {
            return CommunityRole::firstOrCreate(['code' => 'follower'], ['name' => 'Подписчик'])->id;
        });
    }
}
