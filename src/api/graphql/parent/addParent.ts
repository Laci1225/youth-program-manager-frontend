import {clientSideClient} from "@/api/graphql/client";
import {gql} from "@apollo/client";

export default function addParent(values: ParentDataInput) {
    return clientSideClient
    .mutate({
        mutation: gql`
            mutation AddParent($parent: ParentInput!) {
                addParent(parent: $parent) {
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
            },
        },
    }).then(value => value.data.addParent)
}