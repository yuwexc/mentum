import { router, usePage } from "@inertiajs/react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { PageProps } from "@/types";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Loader2Icon, Pencil } from "lucide-react";
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

    if (!isEditing && profile && profile.user.bio) {
        return (
            <article className="w-full bg-white rounded-xl p-6 max-[480px]:p-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">Обо мне</h3>
                    {
                        profile.isMyProfile &&
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                        >
                            <Pencil className="w-4 h-4 mr-1" />
                            Изменить
                        </button>
                    }
                </div>
                <p className="text-gray-600 leading-relaxed">{profile.user.bio}</p>
            </article>
        );
    }

    if (profile && profile.isMyProfile) {
        return (
            <article className="w-full bg-white rounded-xl p-6 max-[480px]:p-4 border-l-4 border-indigo-400">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <h3 className="font-bold text-xl text-gray-800 mb-2">Обо мне</h3>
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
                            <Button
                                variant={"outline"}
                                type="submit"
                                className="border-0 text-white hover:text-white bg-indigo-500 hover:bg-indigo-600"
                                disabled={form.formState.isSubmitting}
                            >
                                {
                                    form.formState.isSubmitting ?
                                        <>
                                            <span>Сохранение</span>
                                            <Loader2Icon className="animate-spin" />
                                        </>
                                        :
                                        <span>Сохранить</span>
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </article>
        );
    }

    return null;
};