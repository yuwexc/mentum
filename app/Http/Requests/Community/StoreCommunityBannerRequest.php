<?php

namespace App\Http\Requests\Community;

use App\Models\Community;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreCommunityBannerRequest extends FormRequest
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
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(redirect()->back()->with('error', 'У вас нет прав на редактирование баннера'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'banner' => 'required|file|extensions:jpg,jpeg,png'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'required' => 'Необходимо добавить файл',
            'file' => 'Значение является не файлом',
            'extensions' => 'Неверный формат файла'
        ];
    }
}
