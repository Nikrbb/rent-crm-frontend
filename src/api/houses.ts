import api from './_axios';

export function createHouse(payload: { name: string; address: string; photo_url?: string }) {
    return api.post('/houses', payload);
}

export function getHouses() {
    return api.get('/houses');
}

export function getHouseById(id: string) {
    return api.get(`/houses/${id}`, { headers: { 'X-Request-Name': 'get-house' } });
}
