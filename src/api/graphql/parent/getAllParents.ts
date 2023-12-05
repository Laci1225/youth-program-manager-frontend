import {ApolloClient, NormalizedCacheObject} from '@apollo/client';
import {clientSideClient} from '@/api/graphql/client';
import {gql} from '@apollo/client';

export default async function getAllParents(client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ParentData[]> {
    let value = await client.query({
        query: gql`
            query {
                getAllParents {
                    id
                    familyName
                    givenName
                    phoneNumbers
                    address
                }
            }
        `, fetchPolicy: "no-cache"
    });
    return await value.data.getAllParents;
}