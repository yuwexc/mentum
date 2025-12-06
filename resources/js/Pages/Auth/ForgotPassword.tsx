import { Button, buttonVariants } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import GuestScreen from '@/Screens/GuestScreen';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';

type ForgotPasswordFields = {
    email: string
}

export default function ForgotPassword({ status }: { status?: string }) {

    const form = useForm<ForgotPasswordFields>({
        defaultValues: {
            email: ''
        },
        mode: 'onBlur',
        shouldFocusError: true
    })

    const onSubmit: SubmitHandler<ForgotPasswordFields> = (data) => {
        form.clearErrors();
        router.post(route('password.email'), data, {
            onError: (errors) => {
                Object.entries(errors).forEach(([field, message]) => {
                    form.setError(field as keyof ForgotPasswordFields, {
                        type: 'server',
                        message: message as string,
                    });
                });
            }
        })
    }

    return (
        <GuestScreen>
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex justify-between">
                        <Link href="/" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
                            <ChevronLeft />
                        </Link>
                        <Link href="/" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center m-auto translate-x-[-18px]">
                            Mentum
                        </Link>
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                        Забыли свой пароль? Без проблем. Просто сообщите нам свой адрес электронной почты, и мы вышлем вам по электронной почте ссылку для сброса пароля, которая позволит вам выбрать новый.
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='email'>Эл. почта</FormLabel>
                                <FormControl>
                                    <Input id='email' type="email" {...field} className="outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="mt-4 flex items-center justify-end">
                        <Button className="ms-4" type="submit">
                            Сбросить пароль
                        </Button>
                    </div>
                </form>
            </Form>
        </GuestScreen>
    );
}
