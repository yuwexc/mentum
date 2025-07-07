import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react"

export const UserInterests = () => {

    const { profile } = usePage<PageProps>().props;

    return (
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
    )
}