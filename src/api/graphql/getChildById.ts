import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ChildData} from "@/model/child-data";

export default async function getChildById(childId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ChildData> {
    return client
    .query({
        query: gql`
            query GetChildById($id: String!){
                getChildById(id : $id){
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
    }).then(value => value.data.getChildById);
}
