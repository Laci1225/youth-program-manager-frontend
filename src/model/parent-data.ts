import {ChildData} from "@/model/child-data";

export interface ParentData {
    id: string
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
}

export interface ParentDataWithChildren {
    id: string
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
    childDtos?: ChildData[]
}

export interface ParentDataWithEmergencyContact {
    parentDto: ParentData,
    isEmergencyContact: boolean
}

export interface ParentDataInput {
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
    childId?: string
}