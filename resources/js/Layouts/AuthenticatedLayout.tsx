import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Avatar } from '@/Components/Profile/Avatar';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Toaster } from '@/Components/ui/sonner';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Authenticated({ children }: { children: ReactNode }) {

    const { auth, flash } = usePage<PageProps>().props;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState<boolean>(false);

    useEffect(() => {
        if (flash) {
            if (flash.success) {
                toast.success(flash.success);
                return;
            }
            if (flash.error) {
                toast.error(flash.error);
                return;
            }
            if (flash.info) {
                toast.info(flash.info)
            }
        }
    }, [flash])

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="border-b border-gray-100 bg-white sticky top-0 z-[997]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <h1 className="text-2xl font-extrabold tracking-tight text-center">Mentum</h1>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 lg:-my-px lg:ms-10 lg:flex">
                                <NavLink
                                    href={route('feed')}
                                    active={route().current('feed')}
                                >
                                    Лента
                                </NavLink>
                                <NavLink
                                    href={route('subscriptions')}
                                    active={route().current('subscriptions')}
                                >
                                    Подписки
                                </NavLink>
                                <NavLink
                                    href={route('communities')}
                                    active={route().current('communities')}
                                >
                                    Сообщества
                                </NavLink>
                                <NavLink
                                    href={route('articles')}
                                    active={route().current('articles')}
                                >
                                    Статьи
                                </NavLink>
                                <NavLink
                                    href={route('challenges')}
                                    active={route().current('challenges')}
                                >
                                    Челленджи
                                </NavLink>

                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-4">
                            <Link
                                href={route('chats')}
                                className='flex items-center gap-2 text-sm text-gray-500 font-medium'
                            >
                                Чаты
                                <MessageCircle strokeWidth={1.35} className="h-5 w-5" />
                            </Link>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                <Avatar photo={auth.user.avatar} className='h-[35px] w-[35px] mr-2' />
                                                {auth.user.first_name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.show', { user: auth.user.username })}
                                        >
                                            Профиль
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Настройки профиля
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Выйти
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' lg:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('feed')}
                            active={route().current('feed')}
                        >
                            Лента
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('subscriptions')}
                            active={route().current('subscriptions')}
                        >
                            Подписки
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('communities')}
                            active={route().current('communities')}
                        >
                            Сообщества
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('articles')}
                            active={route().current('articles')}
                        >
                            Статьи
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('challenges')}
                            active={route().current('challenges')}
                        >
                            Челленджи
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {auth.user.first_name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {auth.user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.show', { user: auth.user.username })}>
                                Профиль
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Настройки профиля
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Выйти
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-4">{children}</main>

            <Toaster richColors expand duration={3000} />
        </div>
    );
}
