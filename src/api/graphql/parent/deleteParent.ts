import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ParentData} from "@/model/parent-data";

export default async function deleteParent(parentId: string,
                                           authToken: string | undefined,
                                           client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeleteParent($id: String!) {
                deleteParent(id : $id){
                    id
                    email
                    familyName
                    givenName
                    phoneNumbers
                    address
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
    });
    return value.data.deleteParent;
}