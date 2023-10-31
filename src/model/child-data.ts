import {Disease} from "@/model/disease";
import {Medicine} from "@/model/medicine";

export interface ChildData {
    id: string,
    familyName: string,
    givenName: string,
    birthDate: Date,
    birthPlace: string,
    address: string,
    diseases: Disease[],
    medicines?: Medicine[] | undefined,
    createdDate: string,
    modifiedDate: string
}

export interface ChildDataInput {
    familyName: string,
    givenName: string,
    birthDate: Date,
    birthPlace: string,
    address: string,
    diseases: Disease[],
    medicines?: Medicine[] | undefined,
}