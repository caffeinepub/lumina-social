import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Post {
    id: string;
    hasStory: boolean;
    content: string;
    author: Principal;
    timestamp: Time;
    isPublic: boolean;
}
export interface Notification {
    id: string;
    metadata?: string;
    userId: Principal;
    notificationType: NotificationType;
    isRead: boolean;
    notifiedBy: Principal;
    timestamp: Time;
}
export interface UserProfile {
    bio: string;
    username: string;
    displayName: string;
    websiteUrl: string;
    isPrivate: boolean;
    avatarUrl: string;
    gender?: Gender;
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum NotificationType {
    like = "like",
    comment = "comment",
    message = "message",
    mention = "mention",
    follow = "follow"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addNotification(postId: string, notificationType: NotificationType): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string, isPublic: boolean): Promise<string>;
    deletePost(postId: string): Promise<void>;
    fetchNotifications(): Promise<Array<Notification>>;
    getAllNotifications(): Promise<Array<Notification>>;
    getAllPosts(): Promise<Array<Post>>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPublicStoriesForUser(userId: Principal): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationAsRead(notificationId: string): Promise<void>;
    publicStories(): Promise<Array<Post>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
