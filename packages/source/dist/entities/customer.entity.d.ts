declare enum IS_MOBILE_VERIFIED {
    YES = "Yes",
    NO = "No"
}
declare enum IS_EMAIL_VERIFIED {
    YES = "Yes",
    NO = "No"
}
export declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class CustomerEntity {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: Date;
    email: string;
    password: string;
    dialCode: string;
    phoneNumber: string;
    altDialCode: string;
    altPhoneNumber: string;
    profileImage: string;
    authType: string[];
    authCode: string;
    isMobileVerified: IS_MOBILE_VERIFIED;
    uniqueToken: string;
    otpCode: string;
    isEmailVerified: IS_EMAIL_VERIFIED;
    verificationCode: string;
    latitude: number;
    langitude: number;
    appVersion: string;
    deviceName: string;
    deviceOs: string;
    deviceType: string;
    deviceToken: string;
    lastLoginAt: Date;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=customer.entity.d.ts.map