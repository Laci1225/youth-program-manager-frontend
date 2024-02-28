import {ApolloClient, NormalizedCacheObject} from '@apollo/client';
import {clientSideClient} from '@/api/graphql/client';
import {gql} from '@apollo/client';
import {ChildData} from '@/model/child-data';

export default async function getAllChildren(authToken: string | undefined,
                                             client: ApolloClient<NormalizedCacheObject> = clientSideClient,
): Promise<ChildData[]> {
    let value = await client.query({
        query: gql`
            query {
                getAllChildren {
                    id
                    familyName
                    givenName
                    birthPlace
                    birthDate
                    address
                    relativeParents {
                        id
                        isEmergencyContact
                    }
                    diagnosedDiseases {
                        name
                        diagnosedAt
                    }
                    regularMedicines {
                        name
                        dose
                        takenSince
                    }
                    hasDiagnosedDiseases
                    hasRegularMedicines
                }
            }
        `,
        fetchPolicy: "no-cache",
        context: {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        },
    });
    return await value.data.getAllChildren;
}