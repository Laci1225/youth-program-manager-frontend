export enum EmployeeType {
    TEACHER,
    ADMINISTRATOR,
    RECEPTIONIST,
}

export interface EmployeeData {
    id: string,
    email: string,
    familyName: string,
    givenName: string,
    phoneNumber: string,
    type: EmployeeType
}

export interface EmployeeDataInput {
    email: string,
    familyName: string,
    givenName: string,
    phoneNumber: string,
    type: EmployeeType
}

export interface EmployeeUpdateDataInput {
    id: string,
    email: string,
    familyName: string,
    givenName: string,
    phoneNumber: string,
    type: EmployeeType
}