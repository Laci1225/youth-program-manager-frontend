import {clientSideClient} from "@/api/graphql/child/client";
import {gql} from "@apollo/client";

export default function addParent(values: ParentDataInput) {
    return clientSideClient
    .mutate({
        mutation: gql`
            mutation AddParent($oarent: ParentInput!) {
                addParent(parent: $parent) {
                    familyName
                    givenName
                    phoneNumbers
                    address
                }
            }
        `,
        variables: {
            child: {
                familyName: values.familyName,
                givenName: values.givenName,
                phoneNumbers: values.phoneNumbers,
                address: values.address,
            },
        },
    })
}