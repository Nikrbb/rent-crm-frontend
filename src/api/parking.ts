import api from './_axios';

export function fetchParkingSpots() {
    return api.get('/parking');
}

export function createParkingSpot(payload: { houseId: number; number: string; locaion?: string }) {
    return api.post('/parking', payload);
}

export function fetchParkingByHouseId(id: string) {
    return api.get(`/parking/${id}`);
}
