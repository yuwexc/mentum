import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { Send } from "lucide-react";
import { Post } from "@/types/Post";
import { CommentInterface } from "@/types/Comment";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
    content: z.string().trim().min(1, { message: "Заполните поле" }),
});

export const CreateCommentComponent = ({ setComments, post, owner, owner_type }: {
    setComments: React.Dispatch<React.SetStateAction<CommentInterface[]>>,
    post: Post,
    owner: string,
    owner_type: string
}) => {

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

            const response = await axios.post(route('post.comment.store', {
                post: post.id
            }), {
                ...data,
                owner_id: post.id,
                owner_type: owner_type,
                user_id: owner
            });

            setComments(prev => [response.data.comment, ...prev]);
            form.setValue('content', '');

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
                toast.error('Ошибка при создании комментария');
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4 border-b border-gray-100">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <textarea
                                    {...field}
                                    placeholder="Написать комментарий..."
                                    className="w-full border-0  p-2 pb-4  text-sm resize-y focus:border-gray-100 focus:ring-0"
                                    rows={1}
                                    onInput={(e) => {
                                        e.currentTarget.style.height = 'auto';
                                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <button type="submit" className="flex justify-center items-center bg-indigo-50 text-indigo-600 p-3 rounded-full">
                    <Send strokeWidth={1.5} size={20} />
                </button>
            </form>
        </Form>
    )
}