declare enum ImageType {
    front = "front",
    rear = "rear",
    side = "side",
    interior = "interior",
    engine = "engine",
    dashboard = "dashboard"
}
export declare class CarImagesEntity {
    carImageId: number;
    carId: number;
    imageName: string;
    imageType: ImageType;
}
export {};
//# sourceMappingURL=car_images.entity.d.ts.map