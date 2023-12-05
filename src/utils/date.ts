export function isStrictDate(value: string | Date) {
    if (value instanceof Date)
        return true
    const isoTimePattern = /T\d{2}:\d{2}:\d{2}Z$/;
    return isoTimePattern.test(value);
}
