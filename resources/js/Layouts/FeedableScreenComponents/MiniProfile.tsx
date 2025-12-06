import { Link, usePage } from "@inertiajs/react"
import { Avatar } from "../../Components/Profile/Avatar"
import { Banner } from "../../Components/Profile/Banner"
import { PageProps } from "@/types";

export const MiniProfile = () => {

    const { auth } = usePage<PageProps>().props;

    return (
        <article className="w-full bg-white rounded-xl p-4 flex flex-col items-center">
            <Banner className="h-20" />
            <Avatar photo={auth.user.avatar} className='-mt-8 border-[4px] border-white h-[70px] w-[70px]' />
            <p className="font-medium">{auth.user.full_name}</p>
            <Link href={`/@${auth.user.username}`} className="font-thin text-gray-400 text-xs">@{auth.user.username}</Link>
        </article>
    )
}