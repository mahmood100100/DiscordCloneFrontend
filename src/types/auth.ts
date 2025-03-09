import { profile } from "./profile";

export interface User {
    id: string;
    userName: string;
    email: string;
    phoneNumber: number;
    roles: string[];
    profile : profile
}

export interface UserRegistration {
    email: string,
    name: string,
    userName: string,
    password: string,
    image: undefined,
}