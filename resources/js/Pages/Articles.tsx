import AuthenticatedScreen from '@/Screens/AuthenticatedScreen';
import { Head } from '@inertiajs/react';

export default function Articles() {
    return (
        <AuthenticatedScreen>
            <Head title=" - Статьи" />

            <p>Статьи</p>
        </AuthenticatedScreen>
    )
}