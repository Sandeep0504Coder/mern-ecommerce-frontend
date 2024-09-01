import { User } from "./types";

export interface MessageResponse{
    success: boolean;
    message: string;
}

export interface UserResponse{
    success: boolean;
    user: User;
}