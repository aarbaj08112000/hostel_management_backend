"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleMapService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let GoogleMapService = class GoogleMapService {
    apiKey;
    googleBaseUrl;
    geocoing;
    directions;
    reverse_geocoding;
    constructor() {
        this.apiKey = 'AIzaSyDGhGk3DTCkjF1EUxpMm5ypFoQ-ecrS2gY';
        this.googleBaseUrl = 'https://maps.googleapis.com/maps/api/';
        this.geocoing = false;
        this.directions = false;
        this.reverse_geocoding = false;
    }
    async geocodeAddress(address) {
        let result = {};
        try {
            console.log(address);
            const response = await axios_1.default.get(this.googleBaseUrl + 'geocode/json', {
                params: {
                    address: address,
                    key: this.apiKey,
                },
            });
            const { data } = response;
            if (data['results'] && data['results'].length > 0) {
                result = data['results'][0];
            }
            else {
                result = {};
            }
        }
        catch (error) {
            result = {};
        }
        return result;
    }
    async getDirections(origin, destination) {
        let result = {};
        try {
            const response = await axios_1.default.get(this.googleBaseUrl + 'directions/json', {
                params: {
                    origin: origin,
                    destination: destination,
                    key: this.apiKey,
                },
            });
            const { data } = response;
            if (data['routes'] && data['routes'].length > 0) {
                result = data['routes'][0];
            }
            else {
                result = {};
            }
        }
        catch (error) {
            result = {};
        }
        return result;
    }
    async getReverseGeoCoding(lat, lng) {
        let result = {};
        try {
            const response = await axios_1.default.get(this.googleBaseUrl + 'geocode/json', {
                params: {
                    latlng: `${lat},${lng}`,
                    key: this.apiKey,
                },
            });
            const { data } = response;
            if (data['results'] && data['results'].length > 0) {
                result = data['results'][0];
            }
            else {
                result = {};
            }
        }
        catch (error) {
            result = {};
        }
        return result;
    }
};
exports.GoogleMapService = GoogleMapService;
exports.GoogleMapService = GoogleMapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleMapService);
//# sourceMappingURL=googlemap.service.js.map