import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {clientSideClient} from "@/api/graphql/client";

export default async function deleteEmployee(parentId: string,
                                             authToken: string | undefined,
                                             client: ApolloClient<NormalizedCacheObject> = clientSideClient) {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeleteEmployee($id: String!) {
                deleteEmployee(id : $id){
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
            id: parentId,
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    })
    return value.data.deleteEmployee;
}