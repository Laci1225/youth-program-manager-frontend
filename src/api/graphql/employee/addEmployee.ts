import {ParentCreateDataInput, ParentData} from "@/model/parent-data";
import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {EmployeeDataInput} from "@/model/employee-data";

export default function addEmployee(values: EmployeeDataInput,
                                    authToken: string | undefined) {
    return clientSideClient
    .mutate(
        {
            mutation: gql`
                mutation AddEmployee($employee: EmployeeInput!) {
                    addEmployee(employee: $employee) {
                        id
                        email
                        familyName
                        givenName
                        phoneNumber
                        type
                    }
                }
            `,
            variables: {
                parent: {
                    email: values.email,
                    familyName: values.familyName,
                    givenName: values.givenName,
                    phoneNumber: values.phoneNumber,
                    type: values?.type,
                },
            },
            context: {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            },
        }
    ).then(value => value.data.addEmployee
    )
}