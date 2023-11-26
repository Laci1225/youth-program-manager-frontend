import {ApolloClient, NormalizedCacheObject} from '@apollo/client';
import {clientSideClient} from '@/api/graphql/client';
import {gql} from '@apollo/client';
import {ChildData} from '@/model/child-data';

export default async function getAllChildren(client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ChildData[]> {
    let value = await client.query({
        query: gql`
            query {
                getAllChildren {
                    id
                    familyName
                    givenName
                    birthDate
                    address
                    hasDiagnosedDiseases
                    hasRegularMedicines
                }
            }
        `,
    });
    return await value.data.getAllChildren;
}