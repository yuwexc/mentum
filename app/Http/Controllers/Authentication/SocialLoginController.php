<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialLoginController extends Controller
{
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->with(['prompt' => 'select_account'])->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $socialite = Socialite::driver('google');

            // Временное отключение проверки SSL (только для разработки!)
            if (app()->isLocal()) {
                $socialite->setHttpClient(new \GuzzleHttp\Client([
                    'verify' => false // Не используйте в продакшене!
                ]));
            }

            $googleUser = $socialite->user();

            $user = User::where('email', $googleUser->email)
                ->orWhere('google_id', $googleUser->getId());

            if (!$user->exists()) {
                session(['google_user_data' => $googleUser]);
                return redirect()->route('profile.complete')->with('info', 'Мы почти закончили! Осталось заполнить пару полей');
            } else {
                $user = $user->first();
                $user->google_id = $googleUser->getId();
                $user->save();
                Auth::login($user);
            }

            return redirect()->intended(route('feed'))->with('success', 'Вы вошли через Google');

        } catch (\Exception $e) {
            logger()->error('Google auth failed: ' . $e->getMessage());
            return redirect(route('login'))->with('error', 'Ошибка входа через Google');
        }
    }
}
