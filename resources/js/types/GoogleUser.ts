export interface GoogleUser {
    id: string,
    name: string,
    email: string,
    avatar: string,
    user: {
        sub: string,
        name: string,
        given_name: string,
        family_name: string,
        picture: string,
        email: string,
        verified_email: boolean,
        id: string,
        email_verified: boolean
    },
    attributes: {
        id: string,
        nickname: string,
        name: string,
        email: string,
        avatar: string,
    }
    token: string,
    refreshToken: string,
    expiresIn: number
}