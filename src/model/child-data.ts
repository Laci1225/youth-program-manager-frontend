import {Disease, Medicine} from "@/form/InputDiseaseHandler";

export interface ChildData{
    id: string,
    familyName: string,
    givenName: string,
    email: string,
    phoneNumber: string,
    birthDate: string,
    birthPlace: string,
    address: string,
    diseases: Disease[],
    medicines: Medicine[],
    createdDate: string,
    modifiedDate: string
}