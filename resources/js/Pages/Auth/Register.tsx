import { Button, buttonVariants } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import GuestScreen from '@/Screens/GuestScreen';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    first_name: z.string().trim()
        .min(1, { message: "Заполните поле" })
        .min(2, { message: "Имя должно быть не менее 2 символов" })
        .max(50, { message: "Имя должно быть не длиннее 50 символов" })
        .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/i, { message: 'Можно использовать только буквы' }),

    last_name: z.string().trim()
        .min(1, { message: "Заполните поле" })
        .min(2, { message: "Фамилия должна быть не менее 2 символов" })
        .max(50, { message: "Фамилия должна быть не длиннее 50 символов" })
        .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/i, { message: 'Можно использовать только буквы' }),

    username: z.string().trim()
        .min(1, { message: "Заполните поле" })
        .min(4, { message: "Никнейм должен быть не менее 4 символов" })
        .max(30, { message: "Никнейм должен быть не длиннее 30 символов" })
        .regex(/^(?=.*[a-z])[a-z\d]+$/, { message: 'Можно использовать только латинские буквы в нижнем регистре и цифры. Обязательна хотя бы одна буква' })
        .toLowerCase(),

    birthdate: z
        .date({ required_error: "Заполните поле" })
        .max(new Date(), {
            message: "Некорректная дата"
        })
        .min(new Date('1900-01-01'), {
            message: "Дата рождения не может быть раньше 1900 года"
        }),

    email: z.string().trim()
        .min(1, { message: "Заполните поле" })
        .email({ message: 'Неверный формат электронной почты' })
        .max(100, { message: 'Email должен быть не длиннее 100 символов' }),

    password: z.string().trim()
        .min(1, { message: "Заполните поле" })
        .min(8, { message: 'Пароль должен быть не менее 8 символов' })
        .max(50, { message: 'Пароль должен быть не длиннее 50 символов' })
        .regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' })
        .regex(/[a-zа-яё]/, { message: 'Пароль должен содержать хотя бы одну строчную букву' })
        .regex(/[A-ZА-ЯЁ]/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
        .regex(/[\W_]/, { message: 'Пароль должен содержать хотя бы один специальный символ' })
        .regex(/^\S*$/, { message: 'Пароль не должен содержать пробелов' })
})

export default function Register() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            username: '',
            birthdate: new Date(),
            email: '',
            password: ''
        },
        mode: 'onBlur',
        shouldFocusError: true
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        form.clearErrors();
        router.post(route('signup.store'), {
            ...values,
            birthdate: format(values.birthdate, 'yyyy-MM-dd'),
        }, {
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
            <Head title="- Регистрация" />

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
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='first_name'>Имя</FormLabel>
                                <FormControl>
                                    <Input id='first_name' {...field} className="outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor='last_name'>Фамилия</FormLabel>
                                <FormControl>
                                    <Input id='last_name' {...field} className="outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <FormField
                        control={form.control}
                        name="birthdate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Дата рождения</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Выберите дату</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Никнейм</FormLabel>
                                <FormControl>
                                    <Input {...field} className="outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                                </FormControl>
                                <FormDescription>
                                    Ваше короткое имя, чтобы вас было проще найти
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button variant={"outline"} className="border-0 bg-indigo-500 text-white hover:text-white hover:bg-indigo-600" type="submit">Зарегистрироваться</Button>
                </form>
            </Form>

        </GuestScreen >
    );
}
