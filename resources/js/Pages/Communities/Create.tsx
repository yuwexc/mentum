import { MiniProfile } from "@/Layouts/FeedableScreenComponents/MiniProfile";
import { UserInterests } from "@/Layouts/FeedableScreenComponents/UserInterests";
import { Avatar } from "@/Components/Profile/Avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import FeedableScreen from "@/Screens/FeedableScreen";
import { PageProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateCommunities() {

    const { topicsList } = usePage<PageProps>().props;

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const formSchema = z.object({
        name: z.string().trim()
            .min(1, { message: "Заполните поле" })
            .min(2, { message: "Название должно быть не менее 2 символов" })
            .max(30, { message: "Название должно быть не длиннее 30 символов" })
            .regex(/^[a-zA-Zа-яА-ЯёЁ\s]+$/i, { message: 'Можно использовать только буквы' }),

        slug: z.string().trim()
            .max(30, {
                message: "Длина ссылки не должна превышать 30 символов"
            })
            .regex(/^[a-zA-Zа_-]*$/, {
                message: 'Можно использовать только латинские буквы, дефисы (-) и подчёркивания (_)'
            })
            .optional()
            .transform(val => val === "" ? undefined : val),

        description: z.string().trim()
            .max(255, { message: "Описание должно быть не длиннее 255 символов" })
            .optional()
            .transform(val => val === "" ? undefined : val),

        avatar: z
            .instanceof(File, { message: "Аватар обязателен" })
            .refine((file) => file.size > 0, "Файл не должен быть пустым")
            .refine(
                (file) => ["image/jpeg", "image/png"].includes(file.type),
                "Допускается только JPEG и PNG"
            ),

        topic_id: z.string().trim()
            .refine(
                value => topicsList?.some(t => t.id === value),
                "Необходимо выбрать тему из списка доступных"
            )
            .refine(
                (value) => topicsList?.some(topic => topic.id === value) ?? false,
                () => ({
                    message: `Тема не найдена`
                })
            )
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            avatar: undefined,
            topic_id: ''
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        form.clearErrors();
        router.post(route('communities.store'), {
            ...values,
            slug: values.slug === "" ? null : values.slug,
            description: values.description === "" ? null : values.description,
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
        <FeedableScreen title=" - Создание сообщества">

            <section className='grow max-w-[768px] flex flex-col gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]'>
                <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Создать новое сообщество</h2>
                    <p className="text-gray-500 text-sm mt-1">Объединяйте людей по интересам</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="block text-sm font-medium text-gray-700">
                                                Название
                                                <span className="ml-1 text-red-500">*</span>
                                            </FormLabel>
                                            <span className="text-xs text-gray-400">
                                                {field.value?.length || 0}/30
                                            </span>
                                        </div>
                                        <FormControl>
                                            <div className="relative mt-1">
                                                <Input
                                                    {...field}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm outline-none transition-all hover:ring-indigo-300 focus:outline-none focus:ring-0 focus:border-transparent"
                                                    placeholder="Крутое название"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="mt-1 text-sm text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">
                                            Ссылка
                                        </FormLabel>
                                        <div className="mt-1 flex rounded-md transition-all hover:ring-indigo-300">
                                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                                mentum.ru/
                                            </span>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                                                    placeholder="ваше-сообщество"
                                                />
                                            </FormControl>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Только латинские буквы, дефисы и подчёркивания</p>
                                        <FormMessage className="mt-1 text-sm text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">
                                            Описание
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative mt-1">
                                                <Textarea
                                                    {...field}
                                                    rows={3}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                                                    placeholder="О чем ваше сообщество?"
                                                />
                                                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                                    {field.value?.length || 0}/255
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="mt-1 text-sm text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">
                                            Аватар
                                            <span className="ml-1 text-red-500">*</span>
                                        </FormLabel>
                                        <div className="mt-1 flex items-center gap-4">
                                            <div className="relative group">
                                                <Avatar
                                                    photo={previewUrl}
                                                    person={false}
                                                    className="h-16 w-16"
                                                />
                                                {previewUrl && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <label className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 border border-indigo-100 hover:border-indigo-200 transition-colors">
                                                <span>Выбрать файл</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            setPreviewUrl(url);
                                                            field.onChange(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Рекомендуемый размер: 256×256px</p>
                                        <FormMessage className="mt-1 text-sm text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="topic_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">
                                            Категория
                                            <span className="ml-1 text-red-500">*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none">
                                                    <SelectValue placeholder="Выберите категорию" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-md border-gray-200 bg-white shadow-lg">
                                                {topicsList?.map((topic) => (
                                                    <SelectItem
                                                        key={topic.id}
                                                        value={topic.id}
                                                        className="px-4 py-2 hover:bg-indigo-50 transition-colors"
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                                                            {topic.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="mt-1 text-sm text-red-600" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end border-t border-gray-100 pt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 transition-all"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Создать сообщество
                            </button>
                        </div>
                    </form>
                </Form>
            </section>

            <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                <div className="sticky top-[81px] flex flex-col gap-4">
                    <MiniProfile />
                    <UserInterests />
                </div>
            </section>

        </FeedableScreen>
    )
}