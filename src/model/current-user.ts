import {EmployeeType} from "@/model/employee-data";

export interface CurrentUser {
    userId: string;
    userType: EmployeeType | "PARENT";
}