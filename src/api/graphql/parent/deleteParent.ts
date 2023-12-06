import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ParentData} from "@/model/parent-data";

export default async function deleteParent(parentId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeleteParent($id: String!) {
                deleteParent(id : $id){
                    id
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
    });
    return value.data.deleteParent;
}