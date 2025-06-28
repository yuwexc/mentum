import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Articles() {
    return (
        <AuthenticatedLayout>
            <Head title=" - Статьи" />

            <p>Статьи</p>
        </AuthenticatedLayout>
    )
}