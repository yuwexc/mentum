import { Button } from "@/Components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/Components/ui/form";
import { Switch } from "@/Components/ui/switch";
import EditProfileScreen from "@/Screens/EditProfileScreen";
import { PageProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    show_birthdate: z.boolean().optional(),
})

export default function Edit() {

    const { auth } = usePage<PageProps>().props;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            show_birthdate: !!auth.user.show_birthdate,
        },
        mode: 'onBlur',
        shouldFocusError: true
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        form.clearErrors();
        router.post(route('profile.update', { user: auth.user.username }), data, {
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
        <EditProfileScreen>
            <div className='w-[calc(100%-4rem)] flex flex-col gap-4 py-4 px-8'>
                <h2 className='font-medium text-lg'>Приватность</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="show_birthdate"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                        <FormLabel>Дата рождения</FormLabel>
                                        <FormDescription>
                                            Показывать мою дату рождения
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button variant={"outline"} className="w-fit border-0 bg-indigo-500 text-white hover:text-white hover:bg-indigo-600" type="submit">
                            <span>Сохранить</span>
                            <Save />
                        </Button>
                    </form>
                </Form>
            </div>
        </EditProfileScreen>
    );
}
