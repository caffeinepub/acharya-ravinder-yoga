import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Enrollment {
    id: bigint;
    name: string;
    email: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface EnrollmentPublic {
    id: bigint;
    name: string;
    timestamp: Time;
}
export interface backendInterface {
    adminDeleteAllEnrollments(apiKey: string): Promise<void>;
    deleteEnrollment(id: bigint, apiKey: string): Promise<void>;
    getAllEnrollments(apiKey: string): Promise<Array<Enrollment>>;
    getEnrollment(id: bigint, apiKey: string): Promise<Enrollment>;
    getPublicEnrollments(): Promise<Array<EnrollmentPublic>>;
    getTotalEnrollments(): Promise<bigint>;
    submitEnrollment(name: string, email: string, phone: string): Promise<bigint>;
    updateEnrollment(id: bigint, name: string, email: string, phone: string, apiKey: string): Promise<void>;
}
