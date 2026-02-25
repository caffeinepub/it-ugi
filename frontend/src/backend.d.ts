import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreativePackage {
    id: string;
    funnelStage: string;
    scripts: Array<Asset>;
    tone: string;
    description: string;
    productName: string;
    shots: Array<Asset>;
    personas: Array<Asset>;
    adCopy: Array<Asset>;
}
export interface Asset {
    id: string;
    content: string;
    name: string;
    assetType: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    filterAssetsByType(assetType: string): Promise<Array<Asset>>;
    getAllAssets(): Promise<Array<Asset>>;
    getAllCreativePackages(): Promise<Array<CreativePackage>>;
    getAsset(id: string): Promise<Asset>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCreativePackage(id: string): Promise<CreativePackage>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveAsset(id: string, name: string, content: string, assetType: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCreativePackage(id: string, productName: string, description: string, funnelStage: string, tone: string, scriptAssets: Array<Asset>, copyAssets: Array<Asset>, personaAssets: Array<Asset>, shotAssets: Array<Asset>): Promise<void>;
}
