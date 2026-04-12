export declare class GoogleMapService {
    private readonly apiKey;
    private readonly googleBaseUrl;
    protected geocoing: boolean;
    protected directions: boolean;
    protected reverse_geocoding: boolean;
    constructor();
    geocodeAddress(address: string): Promise<any>;
    getDirections(origin: string, destination: string): Promise<any>;
    getReverseGeoCoding(lat: string, lng: string): Promise<any>;
}
//# sourceMappingURL=googlemap.service.d.ts.map