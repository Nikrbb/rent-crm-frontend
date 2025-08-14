export interface Reservation {
    id: string;
    spotId: string;
    houseId: string;
    apartmentId?: string;
    userId: string | null;
    startDate: string;
    endDate: string;
    phoneInfo: null;
    carInfo: null;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
