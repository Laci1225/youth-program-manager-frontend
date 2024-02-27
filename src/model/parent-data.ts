import {ChildData} from "@/model/child-data";

export interface ParentData {
    id: string,
    email?: string, //todo make it compulsory
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
}


export interface ParentDataWithChildrenIds {
    id: string
    email?: string, //todo make it compulsory
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
    childIds?: string[]
}

export interface ParentDataWithChildren {
    id: string
    email?: string, //todo make it compulsory
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

export interface ParentCreateDataInput {
    email?: string, //todo make it compulsory
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
    childId?: string
}

export interface ParentUpdateDataInput {
    id: string,
    email?: string, //todo make it compulsory
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string,
    childIds?: string | string[]
}