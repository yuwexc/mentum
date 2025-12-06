import { PageProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { Image, Save } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ReactNode, useEffect, useState } from "react";

const formSchema = z.object({
    banner: z.any()
        .refine((file) => file instanceof File && file.size > 0, "Файл не выбран")
        .refine((file) => file instanceof File && ["image/jpeg", "image/png"]
            .includes(file.type), "Допускается только JPEG и PNG"
        ),
})

export const Banner = ({ photo, className }: { photo: string | null, className?: ReactNode }) => {

    const { community } = usePage<PageProps>().props;

    if (photo) {
        return <div className={`w-full rounded-md ` + className}
            style={{
                backgroundImage: `url(${photo})`,
                backgroundPosition: 'center',
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover'
            }}></div>
    }

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            banner: undefined
        },
        mode: 'onBlur',
        shouldFocusError: true
    })

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
        form.clearErrors();
        router.post(route('community.update.banner', {
            community: community?.community.slug || community?.community.id
        }), data, {
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

    if (community && community.isMyCommunity) {
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className={`w-full rounded-md flex gap-4 items-center justify-center ` + className}
                    style={{
                        backgroundImage: previewUrl ? `url(${previewUrl})` : "none",
                        backgroundColor: previewUrl ? "transparent" : "#f3f4f6",
                        backgroundPosition: 'center',
                        backgroundRepeat: "no-repeat",
                        backgroundSize: 'cover'
                    }}
                >
                    <FormField
                        control={form.control}
                        name="banner"
                        render={({ field }) => (
                            <FormItem>
                                <label htmlFor="banner" className='flex items-center justify-center gap-1 cursor-pointer'>
                                    <span className={`text-gray-400 ${!field.value ? 'mb-4' : ''}`}>Загрузите изображение</span>
                                    <Image strokeWidth={1} size={22} color='#9ca3af' className={!field.value ? 'mb-4' : ''} />
                                </label>
                                <FormControl>
                                    <Input
                                        id="banner"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
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
                    {
                        form.getValues('banner') &&
                        <Button variant={"secondary"} type="submit">
                            <Save strokeWidth={1} size={22} />
                        </Button>
                    }
                </form>
            </Form >
        )
    }

    return (
        <div className={`w-full rounded-md flex gap-4 items-center justify-center bg-gray-100 ` + className} />
    )
}