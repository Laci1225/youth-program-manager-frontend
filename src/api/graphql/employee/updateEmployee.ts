import {EmployeeData, EmployeeDataInput} from "@/model/employee-data";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {clientSideClient} from "@/api/graphql/client";

export default function updateEmployee(employeeData: EmployeeDataInput,
                                       authToken: string | undefined,
                                       client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<EmployeeData> {
    return client.mutate({
        mutation: gql`
            mutation UpdateEmployee($employeeData: EmployeeUpdateInput!) {
                updateEmployee(employee: $employeeData){
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
            employeeData: employeeData,
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    }).then(value => value.data.updateEmployee)
}