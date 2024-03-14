import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {clientSideClient} from "@/api/graphql/client";
import {EmployeeData} from "@/model/employee-data";

export default function getEmployeeById(employeeId: string,
                                        authToken: string | undefined,
                                        client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<EmployeeData> {
    return client.query({
        query: gql`
            query GetEmployeeById($id: String!) {
                getEmployeeById(id : $id){
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
            id: employeeId,
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    }).then(value => value.data.getEmployeeById)
}