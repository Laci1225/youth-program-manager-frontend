import {clientSideClient} from "@/api/graphql/client";
import {ApolloClient, gql, NormalizedCacheObject} from "@apollo/client";
import {ChildDataWithParents} from "@/model/child-data";

export default async function getChildById(childId: string, client: ApolloClient<NormalizedCacheObject> = clientSideClient): Promise<ChildDataWithParents> {
    return client
    .query({
        query: gql`
            query GetChildById($id: String!){
                getChildById(id : $id){
                    childDto {
                        id
                        familyName
                        givenName
                        birthDate
                        birthPlace
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
                    }
                    parents {
                        parentDto {
                            id
                            givenName
                            familyName
                            address
                            phoneNumbers
                        }
                        isEmergencyContact
                    }
                }
            }
        `, fetchPolicy: "no-cache",
        variables: {
            id: childId,
        },
    }).then(value => value.data.getChildById);
}
