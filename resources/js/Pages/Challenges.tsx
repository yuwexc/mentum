import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Challenges() {
    return (
        <AuthenticatedLayout>
            <Head title=" - Челледнжи" />

            <p>Челледнжи</p>
        </AuthenticatedLayout>
    )
}