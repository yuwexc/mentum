import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Subscriptions() {
    return (
        <AuthenticatedLayout>
            <Head title=" - Подписки" />

            <p>Подписки</p>
        </AuthenticatedLayout>
    )
}