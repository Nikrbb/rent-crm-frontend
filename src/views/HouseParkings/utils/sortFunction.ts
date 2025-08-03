// src/utilities/ParkingSorter.ts

import type { Parking } from '@/interfaces/Parking';
import { ParkingStatus } from '@/interfaces/Parking';

export interface SortState {
    byNumber: '' | 'asc' | 'desc';
    byStatus: '' | 'asc' | 'desc';
    byDate: '' | 'asc' | 'desc';
}

export function sortParkingList(items: Parking[], sort: SortState): Parking[] {
    return [...items].sort((a, b) => {
        // 1. Статус
        if (sort.byStatus) {
            const statusPriority = (s: string) => {
                if (s === ParkingStatus.FREE) return 2;
                if (s === ParkingStatus.PARTIALLY_FREE) return 1;
                return 0;
            };
            const aVal = statusPriority(a.status);
            const bVal = statusPriority(b.status);
            if (aVal !== bVal) {
                return sort.byStatus === 'asc' ? aVal - bVal : bVal - aVal;
            }
        }

        // 2. Дата (по первой дате из массива reservations)
        if (sort.byDate) {
            const getFirstDate = (reservations: any[]) => {
                if (!reservations || reservations.length === 0) return new Date(0);
                const sorted = [...reservations].sort(
                    (r1, r2) => new Date(r1.startDate).getTime() - new Date(r2.startDate).getTime(),
                );
                return new Date(sorted[0].startDate);
            };

            const dateA = getFirstDate(a.reservations);
            const dateB = getFirstDate(b.reservations);
            if (dateA.getTime() !== dateB.getTime()) {
                return sort.byDate === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            }
        }

        // 3. Номер (A123, B505)
        if (sort.byNumber) {
            const parse = (val: string) => ({ letter: val[0], num: parseInt(val.slice(1)) });
            const nA = parse(a.number);
            const nB = parse(b.number);

            if (nA.letter !== nB.letter) {
                return sort.byNumber === 'asc'
                    ? nA.letter.localeCompare(nB.letter)
                    : nB.letter.localeCompare(nA.letter);
            }
            return sort.byNumber === 'asc' ? nA.num - nB.num : nB.num - nA.num;
        }

        return 0;
    });
}
