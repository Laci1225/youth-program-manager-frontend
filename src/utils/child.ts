import {Disease} from "@/model/disease";
import {Medicine} from "@/model/medicine";

export const parseDateInDisease = (array: Disease[] | undefined): Disease[] | undefined => {
    return array?.map((item: Disease) => {
        if (item.diagnosedAt) {
            return {...item, diagnosedAt: new Date(item.diagnosedAt)};
        }
        return {...item};
    });
}
export const parseDateInMedicine = (array: Medicine[] | undefined): Medicine[] | undefined => {
    return array?.map((item: Medicine) => {
        if (item.takenSince) {
            return {...item, takenSince: new Date(item.takenSince)};
        }
        return {...item};
    });
}