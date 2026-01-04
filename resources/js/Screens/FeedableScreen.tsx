import { ReactNode } from "react";
import Authenticated from "./AuthenticatedScreen";
import { Head, usePage } from "@inertiajs/react";
import { Link } from '@inertiajs/react';
import { PageProps } from "@/types";
import { ArrowUpRight, BellRing, Crown } from "lucide-react";

export default function FeedableScreen({ children, title }: { children: ReactNode, title: string }) {

    const { auth } = usePage<PageProps>().props;

    return (
        <Authenticated>
            <Head title={title} />

            <div className="min-w-full flex justify-center gap-4 px-4 max-lg:px-14 max-[920px]:px-28 max-sm:px-0">
                <section className="min-w-[320px] max-w-[320px] max-xl:min-w-[140px] max-lg:hidden">
                    <div className="sticky top-[81px] flex flex-col gap-4">
                        {
                            auth.user.user_feature_subscription.feature_subscription_type === 'free' && (
                                <Link
                                    href={route('feature.subscription.create')}
                                    className="w-full max-xl:w-[140px] h-full max-xl:h-[140px] bg-gradient-to-r from-indigo-500 to-purple-600  rounded-xl p-4 max-xl:p-0 flex flex-col justify-between transition-all group">
                                    <div className="max-xl:hidden">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-bold text-xl">Расширенные возможности</h3>
                                            <div className="bg-white/20 p-2 rounded-lg">
                                                <ArrowUpRight strokeWidth={2} color="white" size={20} />
                                            </div>
                                        </div>
                                        <p className="text-white/90 font-medium text-sm">
                                            Полный доступ ко всем эксклюзивным функциям платформы
                                        </p>
                                    </div>

                                    <div className="xl:hidden flex flex-col items-center justify-center h-full gap-2">
                                        <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30">
                                            <Crown size={28} color="white" />
                                        </div>
                                        <span className="text-white text-center font-medium text-sm">Оформить<br />подписку</span>
                                    </div>
                                </Link>
                            )
                        }
                        <article className="w-full max-xl:w-[140px] h-full max-xl:h-[140px] bg-white rounded-xl p-4 max-xl:p-0 flex flex-col gap-2 transition-all">
                            <div className="max-xl:hidden">
                                <div className="flex justify-between items-center gap-4">
                                    <p className="flex items-center gap-2 text-gray-500 text-sm">
                                        <BellRing size={14} />
                                        <span>Уведомления</span>
                                    </p>
                                    <button className="text-sm text-indigo-500">прочитать все</button>
                                </div>
                                <div className="w-full h-28 bg-gray-100 border rounded-lg flex items-center justify-center mt-2">
                                    <p className="text-gray-400 text-xs">*раздел в разработке*</p>
                                </div>
                            </div>

                            <div className="xl:hidden flex flex-col items-center justify-center h-full gap-2">
                                <div className="bg-indigo-500/10 p-3 rounded-full hover:bg-indigo-500/20">
                                    <BellRing size={28} className="text-indigo-500" />
                                </div>
                                <span className="text-indigo-500 font-medium text-sm">Уведомления</span>
                            </div>
                        </article>
                    </div>
                </section>
                {children}
            </div>

        </Authenticated>
    )
} 