import AuthenticatedScreen from '@/Screens/AuthenticatedScreen';
import { Head } from '@inertiajs/react';

export default function Subscriptions() {
    return (
        <AuthenticatedScreen>
            <Head title=" - Подписки" />

            <p>Подписки</p>
        </AuthenticatedScreen>
    )
}