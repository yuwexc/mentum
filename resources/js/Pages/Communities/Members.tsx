import { CommunityManagement } from "@/Layouts/Community/CommunityManagement";
import { MiniProfile } from "@/Layouts/FeedableScreenComponents/MiniProfile";
import { UserInterests } from "@/Layouts/FeedableScreenComponents/UserInterests";
import { Avatar } from "@/Components/Profile/Avatar";
import FeedableScreen from "@/Screens/FeedableScreen";
import { PageProps } from "@/types";
import { User } from "@/types/User";
import { Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { Undo2 } from "lucide-react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/Components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Switch } from "@/Components/ui/switch";


export default function MembersCommunities() {

    const { community } = usePage<PageProps>().props;

    if (!community) {
        return (
            <FeedableScreen title=" - Сообщества">
                <section className="grow max-w-[768px] flex flex-col items-center justify-center gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]">
                    <p className="text-gray-400">Сообщество не найдено</p>
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

    const [members, setMembers] = useState<User[]>(community.members);
    const [hasMore, setHasMore] = useState(true);
    const [nextPage, setNextPage] = useState(2);
    const [loading, setLoading] = useState(false);

    const fetchMoreData = async () => {
        if (!hasMore || loading) return;

        setLoading(true);

        try {
            const response = await axios.get(`/communities/${community.community.slug || community.community.id}/members`, {
                params: { page: nextPage },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            setMembers([...members, ...response.data.members]);
            setHasMore(response.data.hasMore);
            setNextPage(nextPage + 1);

        } catch {
            toast.error('Ошибка загрузки. Попробуйте позже');
        } finally {
            setLoading(false);
        }
    };

    const formSchema = z.object({
        show_members: z.boolean().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            show_members: !!community.community.show_members,
        },
        mode: 'onBlur',
        shouldFocusError: true
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        form.clearErrors();

        try {
            await axios.post(route('community.update.show_members', {
                community: community?.community.slug || community?.community.id
            }), data).then(() => {
                toast.success('Сообщество успешно обновлено');
            });

        } catch {
            toast.error('Ошибка загрузки. Попробуйте позже');
        }
    }

    return (
        <FeedableScreen title=" - Участники сообщества">
            <section className='max-h-max grow max-w-[768px] flex flex-col gap-4 bg-white rounded-xl p-4 min-2xl:max-w-[560px]'>
                <article className="border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{community.community.name}</h2>
                    <p className="text-gray-500 text-sm">участники сообщества</p>
                </article>

                <article>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="show_members"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between">
                                        <div className="space-y-0.5">
                                            <FormLabel>Список подписчиков</FormLabel>
                                            <FormDescription>
                                                Показывать на странице сообщества
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked);
                                                    form.handleSubmit(onSubmit)();
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </article>

                <article>
                    <h3 className="text-sm font-medium text-gray-700">Подписчики</h3>

                    <InfiniteScroll
                        dataLength={members!.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className="flex justify-center py-8 -mt-16 mb-16">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
                            </div>
                        }
                    >
                        {
                            members.map((user, index) =>
                                <div key={index} className="flex items-center gap-2 border-b border-gray-100 py-4 last:border-b-0">
                                    <Avatar photo={user.avatar} className="h-16 w-16 ml-4" />
                                    <p className="font-medium">{user.full_name}</p>
                                    {
                                        community.community.owner === user.username ?
                                            <p className="ml-auto mr-4 text-gray-400 text-sm">Владелец</p>
                                            :
                                            <button onClick={() => {
                                                router.delete(route('community.members.delete', {
                                                    community: community?.community.slug || community?.community.id
                                                }), {
                                                    data: {
                                                        id: user.community_role_id
                                                    }
                                                });
                                            }} className="ml-auto mr-4 text-indigo-500 text-sm">Удалить из подписчиков</button>
                                    }
                                </div>
                            )
                        }
                    </InfiniteScroll>
                </article>
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
        </FeedableScreen>
    )
}