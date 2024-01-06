import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ChildDataWithParents} from "@/model/child-data";

export default async function getChildById(childId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ChildDataWithParents> {
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
                    parents {
                        parentDto {
                            id
                            givenName
                            familyName
                            phoneNumbers
                            address
                        }
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
                    createdDate
                    modifiedDate
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            id: childId,
        },
    }).then(value => value.data.getChildById);
}
