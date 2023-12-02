interface ParentData {
    id: string
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
}

interface ParentDataInput {
    givenName: string,
    familyName: string,
    phoneNumbers: string[],
    address?: string
}