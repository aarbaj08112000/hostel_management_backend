declare enum STATUS {
    BOOKED = "booked",
    PENDING = "pending",
    DRAFT = "draft",
    INPROGRESS = "inprogress"
}
export declare class Booking {
    bookingId: number;
    bookingCode: string;
    customerId: number;
    paymentId: number;
    paymentType: 'full' | 'partial';
    carId: number;
    source: 'admin' | 'front';
    remarks: string;
    status: STATUS;
    totalPrice: number;
    discountPrice: number;
    locationId: number;
    addedDate: Date;
    updatedDate: Date;
    addedBy: number;
    updatedBy: number;
}
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class BookingService {
    bookingServiceId: number;
    serviceId: number;
    bookingId: number;
    addedDate: Date;
    updatedDate: Date;
    addedBy: number;
    updatedBy: number;
    status: STATUS;
}
declare enum CHARGES_TYPE {
    FIXED = "fixed",
    VARIABLE = "variable"
}
export declare class BookingCharges {
    bookingChargesId: number;
    bookingId: number;
    chargesId: number;
    chargesType: CHARGES_TYPE;
    addedDate: Date;
    updatedDate: Date;
}
export {};
//# sourceMappingURL=booking.entity.d.ts.map