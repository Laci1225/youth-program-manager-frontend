import {Disease, Medicine} from "@/form/InputDiseaseHandler";

export interface ChildData{
    id: string,
    familyName: string,
    givenName: string,
    email: string,
    phoneNumber: string,
    birthDate: Date,
    birthPlace: string,
    address: string,
    diagnosedDiseases: Disease[],
    hasDiagnosedDiseases: boolean
    regularMedicines: Medicine[],
    hasRegularMedicines:boolean
    createdDate: string,
    modifiedDate: string
}