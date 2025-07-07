<?php

namespace App\Http\Requests\Community;

use App\Models\Community;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateCommunityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $communityToUpdate = Community::where('id', $this->route('community')->id)
            ->orWhere('slug', $this->route('community')->slug)->firstOrFail();

        return $this->user()->can('update', $communityToUpdate);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $communityToUpdate = Community::where('id', $this->route('community')->id)
            ->orWhere('slug', $this->route('community')->slug)->firstOrFail();

        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:30',
                'regex:/^[a-zA-Zа-яА-ЯёЁ\s]+$/iu',
            ],
            'slug' => [
                'nullable',
                'string',
                Rule::unique('communities')->ignore($communityToUpdate->id),
                'max:30',
                'regex:/^[a-zA-Zа_-]*$/',
            ],
            'description' => [
                'nullable',
                'string',
                'max:255',
            ],
            'avatar' => [
                'nullable',
                File::types(['jpeg', 'png'])
                    ->min(1)
                    ->max(1024 * 5),
            ],
            'topic_id' => [
                'required',
                'string',
                Rule::exists('topics', 'id'),
            ],
            'email' => [
                'nullable',
                'email:rfc,dns,filter',
                'max:100',
                Rule::unique('communities')->ignore($communityToUpdate->id),
            ],
            'website' => [
                'nullable',
                'string',
                'starts_with:http://,https://',
                'url'
            ],
            'show_members' => [
                'nullable',
                'boolean'
            ]
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Заполните поле',
            'name.min' => 'Название должно быть не менее 2 символов',
            'name.max' => 'Название должно быть не длиннее 30 символов',
            'name.regex' => 'Можно использовать только буквы',

            'slug.max' => 'Длина ссылки не должна превышать 30 символов',
            'slug.regex' => 'Можно использовать только латинские буквы, дефисы (-) и подчёркивания (_)',
            'slug.unique' => 'Данная ссылка уже занята',

            'description.max' => 'Описание должно быть не длиннее 255 символов',

            'avatar.required' => 'Аватар обязателен',
            'avatar.min' => 'Файл не должен быть пустым',
            'avatar.mimes' => 'Допускается только JPEG и PNG',

            'topic_id.required' => 'Необходимо выбрать тему из списка доступных',
            'topic_id.exists' => 'Тема не найдена',

            'email.unique' => 'Сообщество с такой эл. почтой уже существует',

            'website.string' => 'Укажите корректную веб-страницу',
            'website.starts_with' => 'Адрес сайта должен начинаться с http:// или https://',
            'website.url' => 'Введите полный URL включая домен (например: https://mysite.ru)'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => $this->slug === '' ? null : $this->slug,
            'description' => $this->description === '' ? null : $this->description,
            'email' => $this->email === '' ? null : $this->email,
            'website' => $this->website === '' ? null : $this->website
        ]);
    }
}
