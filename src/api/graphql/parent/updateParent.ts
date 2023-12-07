import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";

export default async function updateParent(parentId: string, parentData: ParentDataInput, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation UpdateParent($id: String!,$parent: ParentInput!) {
                updateParent(id : $id,parent: $parent){
                    id
                    familyName
                    givenName
                    phoneNumbers
                    address
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            id: parentId,
            parent: parentData
        },
    });
    return value.data.updateParent;
}