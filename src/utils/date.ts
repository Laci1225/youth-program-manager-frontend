import {isValid, parseISO} from "date-fns";

export function isStrictDate(value: string | Date) {
    if (value instanceof Date)
        return true
    const parsedDate = parseISO(value);
    return isValid(parsedDate);
}
