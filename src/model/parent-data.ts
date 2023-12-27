export interface ParentData {
    id: string
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
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
}