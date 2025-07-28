import { FeatureSubscription } from "./FeatureSubscription";
import { Role } from "./Role";

export interface User {
    id: string,
    first_name: string,
    last_name: string,
    full_name: string,
    username: string,

    email: string,
    email_verified_at: string,

    password: string,
    remember_token: string,

    user_system_role: Role,
    user_feature_subscription: FeatureSubscription,

    avatar: string,
    banner: string,
    bio: string,
    website: string,
    gender: string,

    birthdate: string,
    birthdate_formatted: string,
    show_birthdate: boolean,

    community_role_id?: string

    created_at: string,
    created_at_formatted: string,
    updated_at: string,
}