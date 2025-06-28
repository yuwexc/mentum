import { CircleUserRound } from "lucide-react";
import { ReactNode } from "react";

export const Avatar = ({ photo, person = true, className, children }:
    {
        photo: string | null,
        person?: boolean,
        className?: string,
        children?: ReactNode
    }) => {

    return (
        <div className={className + ' flex flex-col items-center justify-center rounded-full ' +
            (photo ?
                `mr-2`
                :
                'text-gray-400')
        }
            style={{
                backgroundImage: photo ? `url(${photo})` : "none",
                backgroundColor: photo ? "transparent" : "#f3f4f6",
                backgroundPosition: 'center',
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover'
            }}>
            {
                !photo && person && <CircleUserRound strokeWidth={0.5} className={"h-full w-full"} />
            }
            {children}
        </div>
    )
}