import api from './_axios';

interface ReservationPayload {
    spotId: string;
    houseId: string;
    apartmentId?: string;
    startDate: Date | null;
    endDate: Date | null;
    phoneInfo?: string;
    carInfo?: string;
    notes?: string;
}

export function fetchAllReservations() {
    return api.get('/reservations');
}

export function createReservation(payload: ReservationPayload) {
    return api.post('/reservations', payload);
}

export function deleteReservation(id: string) {
    return api.delete(`/reservations/${id}`);
}
