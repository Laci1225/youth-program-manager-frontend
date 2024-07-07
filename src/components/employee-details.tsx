import {EmployeeData} from "@/model/employee-data";
import {Label} from "@/components/ui/label";
import {fieldAppearance} from "@/components/fieldAppearance";
import React from "react";

interface EmployeeDetailsProps {
    employeeData: EmployeeData
}

export default function EmployeeDetails({employeeData}: EmployeeDetailsProps) {
    return (
        <div className="border border-gray-200 rounded p-4">
            <div className="mb-6">
                <Label>Full Name:</Label>
                <div className={`${fieldAppearance} mt-2`}>
                    {employeeData.email}
                </div>
            </div>
            <div className="mb-6">
                <Label>Description:</Label>
                <div className={`${fieldAppearance} mt-2 h-fit`}>
                    {employeeData.familyName} {employeeData.givenName}
                </div>
            </div>
            <div className="flex flex-wrap items-center ">
                <div className="mb-6 flex-1">
                    <Label>Price:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {employeeData.phoneNumber}
                    </div>
                </div>
                <div className="mb-6 flex-1">
                    <Label>Number of participation:</Label>
                    <div className={`${fieldAppearance} mt-2`}>
                        {employeeData.type}
                    </div>
                </div>
            </div>
        </div>
    )


}