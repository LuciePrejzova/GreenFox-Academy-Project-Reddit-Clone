export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    password_repeat?: string;
    isAdmin: boolean;
    profilePicture: string;
    // created_at: Date;
}
