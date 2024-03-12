import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {clientSideClient} from "@/api/graphql/client";

export default function GetEmployeeById(employeeId: string,
                                        authToken: string | undefined,
                                        client: ApolloClient<NormalizedCacheObject> = clientSideClient) {
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
    })
}