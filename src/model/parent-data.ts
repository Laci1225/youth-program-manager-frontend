export interface ParentData {
    id: string
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
}

export interface ParentDataInput {
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
}