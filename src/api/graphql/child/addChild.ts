import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {ChildDataInput} from "@/model/child-data";

export default function addChild(values: ChildDataInput) {
    return clientSideClient
    .mutate({
        mutation: gql`
            mutation AddChild($child: ChildInput!) {
                addChild(child: $child) {
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
                    hasDiagnosedDiseases
                    hasRegularMedicines
                }
            }
        `,
        variables: {
            child: {
                familyName: values.familyName,
                givenName: values.givenName,
                birthDate: values.birthDate,
                birthPlace: values.birthPlace,
                address: values.address,
                relativeParents: values.relativeParents?.map(parent => ({
                    id: parent.id,
                    isEmergencyContact: parent.isEmergencyContact
                })),
                diagnosedDiseases: values.diagnosedDiseases?.map(disease => ({
                    name: disease.name,
                    diagnosedAt: disease.diagnosedAt
                })),
                regularMedicines: values.regularMedicines?.map(medicine => ({
                    name: medicine.name,
                    dose: medicine.dose,
                    takenSince: medicine?.takenSince,
                })),
            },
        },
    }).then(value => value.data.addChild)
}