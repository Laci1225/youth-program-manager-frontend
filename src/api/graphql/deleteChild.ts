import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ChildData} from "@/model/child-data";

export default async function deleteChild(childId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ChildData> {
    let value = await client
    .mutate({
        mutation: gql`
            mutation DeleteChild($id: String!) {
                deleteChild(id : $id){
                    id
                    familyName
                    givenName
                    birthDate
                    birthPlace
                    address
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
        variables: {
            id: childId,
        },
    });
    return value.data.deleteChild;
}
