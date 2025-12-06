import { Toaster } from '@/Components/ui/sonner';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

export default function Guest({ children }: PropsWithChildren) {

    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash) {
            if (flash.success) {
                toast.success(flash.success);
                return;
            }
            if (flash.error) {
                toast.error(flash.success);
                return;
            }
            if (flash.info) {
                toast.info(flash.info)
            }
        }
    }, [flash])

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 py-6 sm:justify-center sm:pt-0">

            <div className="mt-6 w-full overflow-hidden bg-white p-5 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>

            <Toaster richColors expand duration={2500} />
        </div>
    );
}
