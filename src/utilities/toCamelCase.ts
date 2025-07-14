function toCamelCase(str: string) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function keysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(keysToCamelCase);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [toCamelCase(key), keysToCamelCase(value)]),
        );
    }
    return obj;
}
