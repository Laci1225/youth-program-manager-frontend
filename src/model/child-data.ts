import {Disease} from "@/model/disease";
import {Medicine} from "@/model/medicine";
import {ParentDataWithEmergencyContact} from "@/model/parent-data";

export interface ChildData {
    id: string,
    familyName: string,
    givenName: string,
    birthDate: Date,
    birthPlace: string,
    address: string,
    relativeParents?: RelativeParent[],
    diagnosedDiseases?: Disease[],
    hasDiagnosedDiseases: boolean,
    regularMedicines?: Medicine[],
    hasRegularMedicines: boolean,
    createdDate: string,
    modifiedDate: string
}

export interface ChildDataWithParents {
    id: string,
    familyName: string,
    givenName: string,
    birthDate: Date,
    birthPlace: string,
    address: string,
    parents?: ParentDataWithEmergencyContact[],
    diagnosedDiseases?: Disease[],
    regularMedicines?: Medicine[],
    hasDiagnosedDiseases: boolean,
    hasRegularMedicines: boolean,
    createdDate: string,
    modifiedDate: string
}

export interface RelativeParent {
    id: string;
    isEmergencyContact: boolean;
}

export interface ChildDataInput {
    familyName: string,
    givenName: string,
    birthDate: Date,
    birthPlace: string,
    address: string,
    relativeParents?: RelativeParent[],
    diagnosedDiseases?: Disease[],
    regularMedicines?: Medicine[],
}

export interface ChildDataUpdateInput {
    id: string,
    familyName: string,
    givenName: string,
    birthDate: Date,
    birthPlace: string,
    address: string,
    relativeParents?: RelativeParent[],
    diagnosedDiseases?: Disease[],
    regularMedicines?: Medicine[],
}