<?php

namespace App\Http\Requests\User;

use App\Models\Topic;
use App\Models\UserInterest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreUserInterestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', UserInterest::class);
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(redirect()->back()->with('error', 'Откройте полный доступ ко всем функциям с подпиской!'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'topics' => ['required', 'array'],
            'topics.*' =>
                [
                    'required',
                    'string',
                    Rule::exists(Topic::class, 'id')
                ]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'topics.required' => 'Необходимо выбрать интересующие Вас темы',
            'topics.array' => 'Значение имеет некорректный формат',
            'topics.*.required' => 'Элемент темы не может быть пустым',
            'topics.*.string' => 'ID темы должен быть строкой',
            'topics.*.exists' => 'Данная тема не найдена в системе',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $user = $this->user();

        if (!$user->user_feature_subscription) {
            $validator->errors()->add(
                'topics',
                'У вас нет активной подписки для выбора тем'
            );
            return;
        }

        $validator->after(function ($validator) use ($user) {
            $maxInterests = $user->user_feature_subscription->user_interest_count;

            if ($maxInterests === null) {
                return;
            }

            if (count($this->topics) > $maxInterests) {
                $validator->errors()->add(
                    'topics',
                    'Вы можете выбрать максимум ' . $maxInterests . ' темы'
                );
            }
        });
    }
}
