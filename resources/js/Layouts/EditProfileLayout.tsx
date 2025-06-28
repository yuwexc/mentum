import { NavLinkEditProfile } from '@/Components/NavLinkEditProfile';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CircleUserRound, KeyRound, Lock, Star, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

export default function EditProfileLayout({ children }: { children: ReactNode }) {

    return (
        <AuthenticatedLayout>
            <Head title=" - Настройки" />

            <div className='flex bg-white mx-24 max-xl:mx-4 rounded-xl max-lg:flex-col'>
                <nav className='p-4 border-r w-[300px] max-lg:w-full max-lg:border-0'>
                    <h2 className='font-medium text-lg'>Настройки профиля</h2>
                    <div className='flex flex-col gap-2 mt-3 w-full max-lg:flex-row max-lg:[&>p]:hidden max-lg:flex-wrap'>
                        <p className='text-sm text-gray-500 px-2 font-semibold'>Общие настройки</p>
                        <NavLinkEditProfile
                            href={route('profile.edit')}
                            active={route().current('profile.edit')}
                        >
                            <CircleUserRound size={18} strokeWidth={1} />
                            <span>Профиль</span>
                        </NavLinkEditProfile>
                        <NavLinkEditProfile
                            href={route('profile.privacy')}
                            active={route().current('profile.privacy')}
                        >
                            <Lock size={18} strokeWidth={1} />
                            <span>Приватность</span>
                        </NavLinkEditProfile>
                        <p className='text-sm text-gray-500 px-2 mt-2 font-semibold'>Безопасность</p>
                        <NavLinkEditProfile
                            href={'/'}
                            active={false}
                        >
                            <KeyRound size={18} strokeWidth={1} />
                            <span>Пароль</span>
                        </NavLinkEditProfile>
                        <p className='text-sm text-gray-500 px-2 mt-2 font-semibold'>Аккаунт</p>
                        <NavLinkEditProfile
                            href={route('feature.subscription.create')}
                            active={route().current('feature.subscription.create')}
                        >
                            <Star size={18} strokeWidth={1} />
                            <span>Моя подписка</span>
                        </NavLinkEditProfile>
                        <NavLinkEditProfile
                            href={'/'}
                            active={false}
                        >
                            <Trash2 size={18} strokeWidth={1} />
                            <span>Удалить аккаунт</span>
                        </NavLinkEditProfile>
                    </div>
                </nav>
                {children}
            </div>

        </AuthenticatedLayout>
    );
}
