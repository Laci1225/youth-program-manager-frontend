import {differenceInDays} from "date-fns";

export function calculateDaysDifference(endDate: Date, startDay: Date = new Date()): number {
    return differenceInDays(new Date(endDate), new Date(startDay));
}
