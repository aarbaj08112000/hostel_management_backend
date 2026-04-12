declare enum IS_EMAIL_VERIFIED {
    YES = "Yes",
    NO = "No"
}
declare enum IS_TEMPORARY_PASSWORD {
    YES = "Yes",
    NO = "No"
}
export declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class AdminEntity {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    dialCode: string;
    phoneNumber: string;
    groupId: number;
    authType: string[];
    authCode: string;
    otpCode: string;
    isEmailVerified: IS_EMAIL_VERIFIED;
    verificationCode: string;
    isTemporaryPassword: IS_TEMPORARY_PASSWORD;
    passwordExpiredOn: Date;
    loginFailedAttempts: number;
    loginLockedUntil: Date;
    lastLoginAt: Date;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=admin.entity.d.ts.map