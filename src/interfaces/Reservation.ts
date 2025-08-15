export interface Reservation {
    id: string;
    spotId: string;
    houseId: string;
    apartmentId?: string;
    userId: string | null;
    startDate: Date;
    endDate: Date;
    phoneInfo: null;
    carInfo: null;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
