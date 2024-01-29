import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";
import {ParentCreateDataInput, ParentData} from "@/model/parent-data";

export default function addParent(values: ParentCreateDataInput): Promise<ParentData> {
    return clientSideClient
    .mutate({
        mutation: gql`
            mutation AddParent($parent: ParentCreateDtoInput!) {
                addParent(parent: $parent) {
                    id
                    familyName
                    givenName
                    phoneNumbers
                    address
                }
            }
        `,
        variables: {
            parent: {
                familyName: values.familyName,
                givenName: values.givenName,
                phoneNumbers: values.phoneNumbers,
                address: values?.address,
                childId: values?.childId || ""
            },
        },
    }).then(value => value.data.addParent)
}