import {differenceInDays} from "date-fns";

export function calculateDaysDifference(endDate: Date, startDay: Date = new Date()): number {
    return new Date(endDate).getTime() - new Date(startDay).getTime();
}
