import { Button } from '@/Components/ui/button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function VerifyEmail() {

    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title=" - Подтверждение электронной почты" />

            <div className="max-w-md w-full mx-auto space-y-6">
                <div className="flex flex-col items-center text-center space-y-2">
                    <MailCheck className="h-12 w-12 text-indigo-500" />
                    <h1 className="text-2xl font-bold tracking-tight">Подтвердите вашу почту</h1>
                    <p className="text-gray-600">
                        Мы отправили ссылку для подтверждения на ваш email
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="space-y-4">
                        <div className="text-sm text-gray-600 text-center">
                            Если вы не получили письмо, проверьте папку "Спам" или запросите повторную отправку.
                        </div>

                        <form onSubmit={submit} className="w-full flex justify-center">
                            <Button
                                type="submit"
                                variant={"outline"}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white"
                                disabled={processing}
                            >
                                {processing ? 'Отправка...' : 'Отправить повторно'}
                            </Button>
                        </form>

                        <div className="flex items-center justify-center pt-4 border-t border-gray-200">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Выйти из аккаунта
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
