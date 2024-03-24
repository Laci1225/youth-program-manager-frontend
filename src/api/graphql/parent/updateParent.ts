import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ParentData, ParentUpdateDataInput} from "@/model/parent-data";

export default async function updateParent(parentData: ParentUpdateDataInput,
                                           authToken: string | undefined,
                                           client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation UpdateParent($parent: ParentUpdateDtoInput!) {
                updateParent(parent: $parent){
                    id
                    email
                    familyName
                    givenName
                    phoneNumbers
                    address
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            parent: parentData
        },
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return value.data.updateParent;
}