<?php

namespace App\Http\Requests\Authentication;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|min:2|max:50|regex:/^[a-zA-Zа-яА-ЯёЁ]+$/iu',
            'last_name' => 'required|string|min:2|max:50|regex:/^[a-zA-Zа-яА-ЯёЁ]+$/iu',
            'username' => 'required|string|min:4|max:30|unique:users,username|regex:/^[a-zA-Z\d]+$/i',
            'email' => 'required|email:rfc,dns,filter|max:100|unique:users,email',
            'password' => ['required', 'string', Password::min(8)->max(50)->mixedCase()->numbers()->symbols()],
            'birthdate' => [
                'required',
                'date',
                'date_format:Y-m-d',
                'after:1900-01-01'
            ],
            'avatar' => 'nullable|string',
            'google_id' => 'nullable|string'
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
            'required' => 'Необходимо заполнить поле',

            'first_name.min' => 'Имя должно быть не менее :min символов',
            'last_name.min' => 'Фамилия должна быть не менее :min символов',
            'username.min' => 'Никнейм должен быть не менее :min символов',
            'password.min' => 'Пароль должен быть не менее :min символов',

            'first_name.max' => 'Имя должно быть не больше :max символов',
            'last_name.max' => 'Фамилия должна быть не больше :max символов',
            'username.max' => 'Никнейм должен быть не больше :max символов',
            'password.max' => 'Пароль должен быть не больше :max символов',

            'string' => 'Значение имеет неверный формат',
            'regex' => 'Значение имеет неверный формат',

            'password.mixed' => 'Пароль должен содержать как заглавные, так и строчные латинские буквы',
            'password.numbers' => 'Пароль должен содержать хотя бы одну цифру',
            'password.symbols' => 'Пароль должен содержать хотя бы один специальный символ',

            'username.unique' => 'Никнейм занят',
            'email.unique' => 'Пользователь с такой эл. почтой уже зарегистрирован',

            'date' => 'Неверный формат даты',
            'date_format' => 'Неверный формат даты',
            'after' => 'Неверный формат даты'
        ];
    }
}
