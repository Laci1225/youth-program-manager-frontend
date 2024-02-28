import {ApolloClient, NormalizedCacheObject} from '@apollo/client';
import {clientSideClient} from '@/api/graphql/client';
import {gql} from '@apollo/client';
import {ParentDataWithChildrenIds} from "@/model/parent-data";

export default async function getAllParents(authToken: string | undefined,
                                            client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentDataWithChildrenIds[]> {
    let value = await client.query({
        query: gql`
            query {
                getAllParents {
                    id
                    familyName
                    givenName
                    phoneNumbers
                    address
                    childIds
                }
            }
        `, fetchPolicy: "no-cache",
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return await value.data.getAllParents;
}