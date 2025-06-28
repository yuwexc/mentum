@component('mail::message')
# Приветствуем в Mentum!

Пожалуйста, нажмите кнопку ниже, чтобы подтвердить ваш email адрес.

@component('mail::button', ['url' => $verificationUrl, 'color' => 'primary'])
Подтвердить email
@endcomponent

Если вы не создавали аккаунт, никаких дополнительных действий не требуется.

С уважением,<br>
Команда Mentum

@component('mail::subcopy')
Если у вас не получается нажать кнопку "Подтвердить Email", скопируйте и вставьте следующую ссылку в адресную строку
браузера:

[{{ $verificationUrl }}]({{ $verificationUrl }})
@endcomponent

@endcomponent