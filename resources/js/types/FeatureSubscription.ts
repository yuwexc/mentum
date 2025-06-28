export interface FeatureSubscription {
    feature_subscription_type: string,
    name: string,
    user_interest_count: number | null,
    community_subscription_count: number | null,
    community_ownership_count: number | null
    user_subscription_count: number | null
    can_subscribe_any_user: boolean,
    price: number
}