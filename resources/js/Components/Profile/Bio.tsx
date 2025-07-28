import { router, usePage } from "@inertiajs/react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { PageProps } from "@/types";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Calendar, Globe, Loader2Icon, Pencil, PersonStanding, Save } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
    bio: z.string().trim().min(1, { message: "Заполните поле" }),
});

export const Bio = () => {

    const { profile } = usePage<PageProps>().props;

    const [isEditing, setIsEditing] = useState(!profile?.user.bio);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bio: profile?.user.bio || "",
        },
        mode: "onBlur",
        shouldFocusError: true,
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
        form.clearErrors();
        router.post(route("profile.update", { user: profile?.user.username }), data, {
            onSuccess: () => {
                setIsEditing(false)
            },
            onError: (errors) => {
                Object.entries(errors).forEach(([field, message]) => {
                    form.setError(field as keyof z.infer<typeof formSchema>, {
                        type: "server",
                        message: message as string,
                    });
                });
            },
        });
    };

    if (!isEditing && profile && (profile.user.website || profile.user.show_birthdate || profile.user.bio)) {
        return (
            <article className="w-full bg-white rounded-xl max-[480px]:p-4">
                <div className="flex items-center gap-3 pl-6 p-4 border-b border-gray-100 max-[920px]:p-0 max-[920px]:border-0">
                    <PersonStanding className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-medium text-gray-800">Обо мне</h3>
                </div>
                <div className="space-y-4 p-4">
                    <div>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-2 py-1 rounded-md">
                            <p className="text-sm text-indigo-800">{profile.user.bio}</p>
                        </div>
                        {
                            profile.isMyProfile &&
                            <button
                                onClick={() => setIsEditing(true)}
                                className="ml-auto text-indigo-800 text-xs flex items-center gap-1"
                            >
                                изменить
                                <Pencil className="w-[10px] h-[10px] ml-1" />
                            </button>
                        }
                    </div>
                    {
                        profile.user.show_birthdate &&
                        <div className="flex items-center gap-3" style={{ marginTop: profile.isMyProfile ? '0' : '16px'}}>
                            <Calendar size={18} className="text-indigo-500" />
                            <p className="text-sm text-gray-700">
                                <span className="text-gray-500">Дата рождения: </span>
                                <span className="font-medium">{profile.user.birthdate_formatted}</span>
                            </p>
                        </div>
                    }
                    {
                        profile.user.website && (
                            <a
                                href={profile.user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors"
                            >
                                <Globe size={18} className="text-indigo-500" />
                                <span className="text-gray-700">Сайт</span>
                            </a>
                        )
                    }
                </div>
            </article>
        );
    }

    if (profile && profile.isMyProfile) {
        return (
            <article className="w-full bg-white rounded-xl">
                <div className="flex items-center gap-3 pl-6 p-4 border-b border-gray-100 max-[920px]:p-0 max-[920px]:border-0">
                    <PersonStanding className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-medium text-gray-800">Обо мне</h3>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Напишите пару предложений о себе"
                                            className="min-h-[100px] focus:border-0"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Это увидят другие пользователи.
                                    </p>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg text-sm font-medium text-white hover:text-white bg-indigo-500 hover:bg-indigo-600 p-1 px-2"
                                disabled={form.formState.isSubmitting}
                            >
                                <span>Сохранить</span>
                                <Save size={16} />
                            </button>
                        </div>
                    </form>
                </Form>
            </article>
        );
    }

    return null;
};