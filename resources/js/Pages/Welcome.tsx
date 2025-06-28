import { DynamicTagline } from '@/Components/DynamicTagline';
import { buttonVariants } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="" />
            <main className="bg-gray-50 h-dvh flex flex-col justify-center items-center gap-5 px-6">
                <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight text-center">
                    <span>Mentum -{' '}</span>
                    <DynamicTagline phrases={['Создавай.', 'Исследуй.', 'Делись.', 'Расти.']} style={{ display: 'inline' }} />
                </h1>

                <p className="text-center max-w-2xl text-base sm:text-lg leading-relaxed text-gray-700">
                    Платформа, где авторы и сообщества делятся контентом, запускают челленджи
                    и находят свою аудиторию. Здесь ценят идеи, глубину и живое участие
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/signup" className={buttonVariants({ variant: 'outline' }) + ' border-0 bg-indigo-500 text-white hover:text-white hover:bg-indigo-600'}>
                        Начать бесплатно
                    </Link>
                    <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
                        Войти
                    </Link>
                </div>
            </main>
        </>
    );
}
