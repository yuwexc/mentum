<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'owner_type' => $this->owner_type,
            'owner' => $this->whenLoaded('owner', $this->getOwnerData()),
            'content' => $this->content,
            'view_count' => Number::abbreviate($this->view_count),
            'created_at' => $this->formatCreatedAt(),
            'comments' => [
                'data' => CommentResource::collection($this->whenLoaded('comments')),
                'hasMore' => $this->comments()->count() > 1 ?? false
            ],
            'like_count' => Number::abbreviate($this->likes()->count()),
            'is_liked' => $this->likes()->where('user_id', auth()->id())->exists(),
        ];
    }

    protected function getOwnerData(): array
    {
        $data = ['id' => $this->owner->id];
        $data['avatar'] = $this->owner->avatar;

        if ($this->owner_type == 'user') {
            $data['username'] = $this->owner->username;
            $data['full_name'] = $this->owner->full_name;
        }

        if ($this->owner_type == 'community') {
            $data['name'] = $this->owner->name;
        }

        return $data;
    }

    protected function formatCreatedAt(): string
    {
        $created = $this->created_at;

        if ($created->lt(now()->subDays(3))) {
            return $created->format('d.m H:i');
        }

        return $created->diffForHumans();
    }

}
