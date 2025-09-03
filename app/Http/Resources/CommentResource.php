<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

class CommentResource extends JsonResource
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
            'content' => $this->content,
            'author' => $this->whenLoaded('author', function () {
                return [
                    'id' => $this->author->id,
                    'full_name' => $this->author->full_name ?? 'Аноним',
                    'avatar' => $this->author->avatar ?? null,
                ];
            }),
            'like_count' => Number::abbreviate($this->likes()->count()),
            'is_liked' => $this->likes()->where('user_id', auth()->id())->exists(),
            'created_at' => $this->created_at->format('d.m.Y H:i'),
        ];
    }
}
