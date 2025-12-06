import { Plus } from "lucide-react";
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { router } from "@inertiajs/react";
import { Post } from "@/types/Post";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
    content: z.string().trim().min(1, { message: "Заполните поле" }),
});

export const CreatePostComponent = ({ owner, owner_type, setPostItems }:
    {
        owner: string,
        owner_type: string,
        setPostItems: React.Dispatch<React.SetStateAction<Post[]>>
    }) => {

    const [wannaCreate, setWannaCreate] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
        mode: "onBlur",
        shouldFocusError: true,
    });

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {

        try {
            form.clearErrors();

            const response = await axios.post(route('post.store'), {
                ...data,
                owner_id: owner,
                owner_type: owner_type
            });

            form.setValue('content', '');
            setPostItems(prev => [response.data.post, ...prev]);
            setWannaCreate(false);

            toast.success(response.data.message);

        } catch (error: any) {
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, message]) => {
                    form.setError(field as keyof z.infer<typeof formSchema>, {
                        type: "server",
                        message: (message as string[])[0],
                    });
                });
            } else {
                toast.error('Ошибка при создании поста');
            }
        }
    };

    if (wannaCreate) {
        return (
            <article className="bg-white rounded-xl">
                <div className="flex justify-center items-center gap-2 p-4 border-b border-gray-100">
                    <Plus strokeWidth={2} size={18} className="text-indigo-500" />
                    <h3 className="text-center font-medium text-gray-800">Новый пост</h3>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <textarea
                                            {...field}
                                            placeholder="О чем вы думаете?"
                                            className="w-full border-0 border-b border-gray-100 p-0 pb-1 text-sm resize-y focus:border-gray-100 focus:ring-0"
                                            autoFocus
                                            rows={4}
                                            onInput={(e) => {
                                                e.currentTarget.style.height = 'auto';
                                                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end items-center">
                            {/* <div className="flex gap-2">
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l0 20M2 12l20 0" />
                            </svg>
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                            </svg>
                            </button>
                            </div> */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setWannaCreate(false)}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 text-sm rounded-lg transition-colors"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                                >
                                    Опубликовать
                                </button>
                            </div>
                        </div>
                    </form>
                </Form>
            </article>
        )
    }

    return (
        <article className="bg-white p-2 rounded-xl">
            <button
                onClick={() => setWannaCreate(true)}
                className="w-full flex justify-center items-center gap-2 bg-white hover:bg-indigo-50 transition-colors rounded-lg p-2 group"
            >
                <Plus strokeWidth={2} size={18} className="text-indigo-500" />
                <span className="text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">
                    Создать пост
                </span>
            </button>
        </article>
    )
}