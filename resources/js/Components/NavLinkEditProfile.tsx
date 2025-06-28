import { InertiaLinkProps, Link } from '@inertiajs/react';

export function NavLinkEditProfile({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {

    return (
        <Link
            {...props}
            className={`flex items-center gap-1 p-2 text-sm rounded-lg ${active ?
                'bg-indigo-100 text-indigo-700'
                :
                'text-gray-500'
                } ` + className}
        >
            {children}
        </Link>
    );
}