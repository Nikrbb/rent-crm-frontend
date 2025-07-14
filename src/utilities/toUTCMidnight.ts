export const toUTCMidnight = (date: Date | null): Date | null => {
    if (!date) return date;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000);
};
