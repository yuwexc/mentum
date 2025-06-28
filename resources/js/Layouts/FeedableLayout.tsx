import { ReactNode } from "react";
import Authenticated from "./AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Avatar } from '@/Components/Profile/Avatar';
import { Link } from '@inertiajs/react';
import { Banner } from "@/Components/Profile/Banner";
import { PageProps } from "@/types";
import { ArrowUpRight, BellRing } from "lucide-react";

export default function FeedableLayout({ children, title }: { children: ReactNode, title: string }) {

    const { auth, profile } = usePage<PageProps>().props;

    return (
        <Authenticated>
            <Head title={title} />

            <div className="min-w-full flex gap-4 px-28 max-xl:px-4 max-lg:px-14 max-[920px]:px-28 max-sm:px-4">
                <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                    <div className="sticky top-[81px] flex flex-col gap-4">
                        {
                            auth.user.user_feature_subscription.feature_subscription_type === 'free' &&
                            <Link
                                href={route('feature.subscription.create')}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4"
                            >
                                <div className="flex flex-col h-full justify-between gap-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-bold text-xl">Расширенные возможности</h3>
                                        </div>
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <ArrowUpRight strokeWidth={2} color="white" size={20} />
                                        </div>
                                    </div>
                                    <p className="text-white/90 font-medium text-sm">Полный доступ ко всем эксклюзивным функциям платформы</p>
                                </div>
                            </Link>
                        }
                        <article className="w-full bg-white rounded-xl p-4 flex flex-col items-center gap-2">
                            <div className="w-full flex justify-between items-center gap-4">
                                <p className="flex items-center gap-2 text-gray-500 text-sm self-start">
                                    <span>Уведомления</span>
                                    <BellRing size={14} />
                                </p>
                                <button className="text-sm text-indigo-500">прочитать все</button>
                            </div>
                            <div className="w-full h-28 bg-gray-100 border rounded-lg flex items-center justify-center">
                                <p className="text-gray-400 text-xs">*раздел находится в стадии разработки*</p>
                            </div>
                        </article>
                    </div>
                </section>
                {children}
                <section className="min-w-[320px] max-w-[320px] max-lg:hidden">
                    <div className="sticky top-[81px] flex flex-col gap-4">
                        <article className="w-full bg-white rounded-xl p-4 flex flex-col items-center">
                            <Banner className="h-20" />
                            <Avatar photo={auth.user.avatar} className='-mt-8 border-[4px] border-white h-[70px] w-[70px]' />
                            <p className="font-medium">{auth.user.full_name}</p>
                            <Link href={`@${auth.user.username}`} className="font-thin text-gray-400 text-xs">@{auth.user.username}</Link>
                        </article>
                        <article className="w-full bg-white rounded-xl p-4 flex flex-col items-center gap-2">
                            <p className="text-gray-500 text-sm self-start">Ваши интересы</p>
                            <div className='w-full flex flex-wrap gap-2'>
                                {
                                    profile && profile.interests && profile.interests.map((interest, index) =>
                                        <Link href={`/#${interest.code}`} className={'inline-flex items-center rounded-md border text-xs font-semibold transition-colors px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'} key={index}>#{interest.name}</Link>
                                    )
                                }
                                <Link href={route('user.interests.create')} className={'inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold transition-colors text-white bg-indigo-500 hover:bg-indigo-600'}>добавить тему</Link>
                            </div>
                        </article>
                    </div>
                </section>
            </div>

        </Authenticated>
    )
} 