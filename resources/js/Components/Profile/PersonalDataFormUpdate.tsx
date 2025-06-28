import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Save } from "lucide-react"
import { Calendar } from "../ui/calendar"
import { router, usePage } from "@inertiajs/react"
import { PageProps } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

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

    website: z.string()
        .optional()
        .transform((val) => val?.trim())
        .refine(
            (url) => !url || url.startsWith('http://') || url.startsWith('https://'),
            { message: 'URL должен начинаться с http:// или https://' }
        )
        .refine(
            (url) => {
                if (!url) return true;
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            },
            { message: 'Некорректный URL (пример: https://example.com)' }
        ),

    gender: z.string()
        .optional()

})

export const PersonalDataFormUpdate = () => {

    const { auth } = usePage<PageProps>().props;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: auth.user.first_name,
            last_name: auth.user.last_name,
            username: auth.user.username,
            birthdate: new Date(auth.user.birthdate),
            email: auth.user.email,
            website: auth.user.website || undefined,
            gender: auth.user.gender || undefined
        },
        mode: 'onBlur',
        shouldFocusError: true
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        form.clearErrors();
        router.post(route('profile.update', { user: auth.user.username }), {
            ...values,
            website: values.website === "" ? null : values.website,
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 px-6 mt-2 max-md:grid-cols-1 max-sm:px-0">
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor='first_name'>Имя</FormLabel>
                            <FormControl>
                                <Input id='first_name' {...field} className="shadow-none outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
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
                                <Input id='last_name' {...field} className="shadow-none outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
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
                                <Input id='email' {...field} className="shadow-none outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Дата рождения</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild className="shadow-none">
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
                                <Input {...field} className="shadow-none outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ваш сайт</FormLabel>
                            <FormControl>
                                <Input {...field} className="shadow-none outline-none focus:outline-none focus:ring-0 focus:border-transparent" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ваш пол</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Укажите пол" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="male">мужской</SelectItem>
                                    <SelectItem value="female">женский</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant={"outline"} className="w-fit border-0 bg-indigo-500 text-white hover:text-white hover:bg-indigo-600 self-end" type="submit">
                    <span>Сохранить</span>
                    <Save />
                </Button>
            </form>
        </Form>
    )
}