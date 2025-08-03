import type { Reservation } from './Reservation';

export enum ParkingStatus {
    OCCUPIED = 'occupied',
    FREE = 'free',
    PARTIALLY_FREE = 'free_with_future_reservations',
}

export interface Parking {
    id: string;
    houseId: string;
    status: ParkingStatus;
    number: string;
    location: string;
    reservations: Reservation[];
}
