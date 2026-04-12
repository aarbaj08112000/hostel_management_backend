declare const access: {
    'admin-portal-1-0': {
        api_key: string;
        client_name: string;
        client_version: string;
        expiry_date: string;
        token_info: {
            algorithm: string;
            issuer: string;
            audience: string;
            expiry: number;
        };
        api_info: {
            create: string;
            verify: string;
            payload: {
                id: string;
                email: string;
                group_id: string;
            };
            required: any[];
        };
    };
    'mobile-portal-1-0': {
        api_key: string;
        client_name: string;
        client_version: string;
        expiry_date: string;
        token_info: {
            algorithm: string;
            issuer: string;
            audience: string;
            expiry: number;
        };
        api_info: {
            create: string;
            verify: string;
            payload: {
                id: string;
                email: string;
            };
            required: string[];
        };
    };
};
export default access;
//# sourceMappingURL=cit-api-access.d.ts.map