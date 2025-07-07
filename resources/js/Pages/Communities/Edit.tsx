import { CommunityManagement } from "@/Components/Community.tsx/CommunityManagement";
import { MiniProfile } from "@/Components/FeedableLayoutComponents/MiniProfile";
import { UserInterests } from "@/Components/FeedableLayoutComponents/UserInterests";
import FeedableLayout from "@/Layouts/FeedableLayout";
import { PageProps } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/Components/ui/textarea";
import { Globe, Mail, Save, Undo2 } from "lucide-react";

export default function EditCommunities() {

    const { community } = usePage<PageProps>().props;

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

        topic_id: z.string().trim(),

        email: z.string()
            .trim()
            .max(100, { message: 'Email должен быть не длиннее 100 символов' })
            .optional()
            .refine(
                (val) => val === undefined || val === "" || z.string().email().safeParse(val).success,
                { message: 'Неверный формат электронной почты' }
            )
            .transform(val => val === "" ? undefined : val),

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
            )
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: community?.community.name,
            slug: community?.community.slug || '',
            description: community?.community.description || '',
            topic_id: community?.community.topic.id,
            email: community?.community.email || '',
            website: community?.community.website || ''
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        form.clearErrors();
        router.post(route('community.update', {
            community: community?.community.slug || community?.community.id
        }), {
            ...values,
            slug: values.slug === "" ? null : values.slug,
            description: values.description === "" ? null : values.description,
            email: values.email === "" ? null : values.email,
            website: values.website === "" ? null : values.website,
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

    if (!community) {
        return (
            <FeedableLayout title=" - Сообщества">
                <section className="grow flex flex-col items-center justify-center gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p className="text-gray-400">Сообщество не найдено</p>
                </section>
                <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                    <div className="sticky top-[81px] flex flex-col gap-4">
                        <MiniProfile />
                        <UserInterests />
                    </div>
                </section>
            </FeedableLayout>
        )
    }

    return (
        <FeedableLayout title=" - Настройки сообщества">

            <section className='grow flex flex-col gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]'>
                <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{community.community.name}</h2>
                    <p className="text-gray-500 text-sm">режим редактирования</p>
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
                                                <SelectItem
                                                    key={community.community.topic.id}
                                                    value={community.community.topic.id}
                                                    className="px-4 py-2 hover:bg-indigo-50 transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                                                        {community.community.topic.name}
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="mt-1 text-sm text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-medium text-gray-700">Эл. почта</FormLabel>
                                        <FormControl>
                                            <div className="relative mt-1">
                                                <Input
                                                    {...field}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm outline-none transition-all hover:ring-indigo-300 focus:outline-none focus:ring-0 focus:border-transparent"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <Mail size={18} className="text-gray-400" />
                                                </div>
                                            </div>
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
                                        <FormLabel className="block text-sm font-medium text-gray-700">Cайт</FormLabel>
                                        <FormControl>
                                            <div className="relative mt-1">
                                                <Input
                                                    {...field}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm outline-none transition-all hover:ring-indigo-300 focus:outline-none focus:ring-0 focus:border-transparent"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <Globe size={18} className="text-gray-400" />
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end border-t border-gray-100 pt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 transition-all"
                            >
                                <Save size={16} className="mr-1" />
                                <span>Редактировать сообщество</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </section>

            <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                <div className="sticky top-[81px] flex flex-col gap-4">
                    <article className="w-full bg-white rounded-xl overflow-hidden">
                        <Link
                            href={route("community.show", { community: community.community.slug || community.community.id })}
                            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                            <Undo2 className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700 text-sm">Вернуться на страницу сообщества</span>
                        </Link>
                    </article>
                    <CommunityManagement community={community.community} />
                </div>
            </section>
        </FeedableLayout>
    )
}