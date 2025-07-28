<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class InteractionStatus extends Model
{
    use HasUlids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'interaction_statuses';

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

    public static function getRequestedInteractionStatusID(): string
    {
        return cache()->remember('requested_interaction_status_id', 3600, function () {
            return InteractionStatus::firstOrCreate(['code' => 'requested'], ['name' => 'Запрошено'])->id;
        });
    }

    public static function getFollowedInteractionStatusID(): string
    {
        return cache()->remember('followed_interaction_status_id', 3600, function () {
            return InteractionStatus::firstOrCreate(['code' => 'followed'], ['name' => 'Подписан'])->id;
        });
    }

    public static function getBannedInteractionStatusID(): string
    {
        return cache()->remember('banned_interaction_status_id', 3600, function () {
            return InteractionStatus::firstOrCreate(['code' => 'banned'], ['name' => 'Заблокирован'])->id;
        });
    }
}
