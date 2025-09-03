<?php

namespace App\Http\Requests\Comment;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Comment::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'owner_id' => [
                'required',
                'string'
            ],
            'owner_type' => [
                'required',
                'string'
            ],
            'user_id' => [
                'required',
                'string'
            ],
            'content' => [
                'required',
                'string',
                'max:512'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'owner_id.required' => 'Необходимо указать владельца записи.',
            'owner_id.string' => 'Идентификатор владельца должен быть строкой.',

            'content.required' => 'Поле содержимого обязательно для заполнения.',
            'content.string' => 'Содержимое должно быть текстом.',
            'content.max' => 'Превышена максимальная длина содержимого (:max символов).'
        ];
    }
}
