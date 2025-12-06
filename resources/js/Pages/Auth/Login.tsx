import GoogleLoginButton from '@/Components/GoogleLoginButton';
import { Button, buttonVariants } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import GuestScreen from '@/Screens/GuestScreen';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    email: z.string().trim().min(1, { message: "Заполните поле" }),
    password: z.string().trim().min(1, { message: "Заполните поле" }),
})

export default function Login() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onBlur',
        shouldFocusError: true
    })

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
        form.clearErrors();
        router.post(route('login'), data, {
            onError: (errors) => {
                Object.entries(errors).forEach(([field, message]) => {
                    form.setError(field as keyof z.infer<typeof formSchema>, {
                        type: 'server',
                        message: message as string,
                    });
                });
            }
        })
    }

    return (
        <GuestScreen>
            <Head title=" - Вход" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-b pb-6">
                    <div className="flex justify-between">
                        <Link href="/" className={buttonVariants({ variant: 'outline', size: 'icon' })}>
                            <ChevronLeft />
                        </Link>
                        <Link href="/" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center m-auto translate-x-[-18px]">
                            Mentum
                        </Link>
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='email'>Эл. почта</FormLabel>
                                <FormControl>
                                    <Input id='email' {...field} className="outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='password'>Пароль</FormLabel>
                                <FormControl>
                                    <Input id='password' type="password" {...field} className="outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="mt-4 flex items-center">
                        {/* <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Забыли пароль?
                        </Link> */}
                        <Button variant={"outline"} className="w-full border-0 bg-indigo-500 text-white hover:text-white hover:bg-indigo-600" type="submit">Войти</Button>
                    </div>
                </form>
                <GoogleLoginButton />
            </Form>
        </GuestScreen>
    );
}
