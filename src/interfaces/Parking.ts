import type { Reservation } from './Reservation';

export interface Parking {
    id: string;
    houseId: string;
    status: string;
    number: string;
    location: string;
    reservations: Reservation[];
}
