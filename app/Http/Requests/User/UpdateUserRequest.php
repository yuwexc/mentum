<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $userToUpdate = User::where('username', $this->route('user')->username)->firstOrFail();
        return $this->user()->can('update', $userToUpdate);
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(redirect()->back()->with('error', 'У вас нет прав на редактирование данных этого пользователя'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'nullable|string|min:2|max:50|regex:/^[a-zA-Zа-яА-ЯёЁ]+$/iu',
            'last_name' => 'nullable|string|min:2|max:50|regex:/^[a-zA-Zа-яА-ЯёЁ]+$/iu',
            'username' => [
                'nullable',
                'string',
                'min:4',
                'max:30',
                Rule::unique('users')->ignore($this->user()->id),
                'regex:/^[a-zA-Z\d]+$/i'
            ],
            'email' => [
                'nullable',
                'email:rfc,dns,filter',
                'max:100',
                Rule::unique('users')->ignore($this->user()->id),
            ],
            'birthdate' => [
                'nullable',
                'date',
                'date_format:Y-m-d',
                'after:1900-01-01'
            ],
            'bio' => ['nullable', 'string', 'max:500'],
            'website' => [
                'nullable',
                'string',
                'starts_with:http://,https://',
                'url'
            ],
            'gender' => [
                'nullable',
                'string',
                Rule::in(['male', 'female'])
            ],
            'show_birthdate' => [
                'nullable',
                'boolean'
            ]
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'first_name' => 'Имя',
            'last_name' => 'Фамилия',
            'username' => 'Никнейм',
            'email' => 'Эл. почта',
            'password' => 'Пароль',
            'birthdate' => 'Дата рождения'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'string' => 'Значение имеет неверный формат',
            'boolean' => 'Значение имеет неверный формат',
            'bio.max' => 'Биография не должна превышать :max символов',

            'required' => 'Необходимо заполнить поле',

            'first_name.min' => 'Имя должно быть не менее :min символов',
            'last_name.min' => 'Фамилия должна быть не менее :min символов',
            'username.min' => 'Никнейм должен быть не менее :min символов',

            'first_name.max' => 'Имя должно быть не больше :max символов',
            'last_name.max' => 'Фамилия должна быть не больше :max символов',
            'username.max' => 'Никнейм должен быть не больше :max символов',

            'regex' => 'Значение имеет неверный формат',

            'username.unique' => 'Никнейм занят',
            'email.unique' => 'Пользователь с такой эл. почтой уже зарегистрирован',

            'date' => 'Неверный формат даты',
            'date_format' => 'Неверный формат даты',
            'after' => 'Неверный формат даты',

            'website.string' => 'Укажите корректную веб-страницу',
            'website.starts_with' => 'Адрес сайта должен начинаться с http:// или https://',
            'website.url' => 'Введите полный URL включая домен (например: https://mysite.ru)',

            'gender.in' => 'Некорректное значение'
        ];
    }
}
