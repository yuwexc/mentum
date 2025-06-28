import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { Save, Trash2 } from "lucide-react";
import { PageProps } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

const formSchema = z.object({
    avatar: z.any()
        .refine((file) => file instanceof File && file.size > 0, "Файл не выбран")
        .refine((file) => file instanceof File && ["image/jpeg", "image/png"].includes(file.type), "Допускается только JPEG и PNG"),
})

export const AvatarFormUpdate = () => {

    const { auth } = usePage<PageProps>().props;

    const [previewUrl, setPreviewUrl] = useState<string | null>(auth.user.avatar);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            avatar: undefined
        },
        mode: 'onBlur',
        shouldFocusError: true
    })

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
        form.clearErrors();
        router.post(route('user.avatar'), data, {
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

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleDeleteAvatar = () => {
        form.clearErrors();
        setPreviewUrl(null);
        router.delete(route('user.avatar.delete'), {
            onError: (errors) => {
                Object.entries(errors).forEach(([field, message]) => {
                    form.setError(field as keyof z.infer<typeof formSchema>, {
                        type: 'server',
                        message: message as string,
                    });
                });
            }
        })
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`w-full flex flex-col gap-4 items-start justify-center`}>
                <div className={'flex flex-col items-center justify-center mt-4 h-[140px] aspect-square rounded-full self-center'}
                    style={{
                        backgroundImage: previewUrl ? `url(${previewUrl})` : "none",
                        backgroundColor: previewUrl ? "transparent" : "#f3f4f6",
                        backgroundPosition: 'center',
                        backgroundRepeat: "no-repeat",
                        backgroundSize: 'cover'
                    }}></div>
                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Аватар</FormLabel>
                            <FormControl>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = URL.createObjectURL(file);
                                            setPreviewUrl(url);
                                            field.onChange(file);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-wrap gap-4">
                    <Button variant={"outline"} className="border-0 bg-indigo-500 text-white hover:text-white hover:bg-indigo-600" type="submit">
                        <span>Сохранить</span>
                        <Save />
                    </Button>
                    {
                        auth.user.avatar &&
                        <AlertDialog>
                            <AlertDialogTrigger className={buttonVariants({ variant: 'outline' }) + "w-fit border-0 bg-red-500 text-white hover:text-white hover:bg-red-600"} type="button">
                                <span>Удалить фото</span>
                                <Trash2 />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Сообщение</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Вы уверены, что хотите удалить аватар?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAvatar} className="border-0 bg-red-500 text-white hover:text-white hover:bg-red-600">Удалить</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    }
                </div>
            </form>
        </Form >
    )
}