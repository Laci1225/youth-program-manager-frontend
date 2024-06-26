import {ParentDataWithChildren} from "@/model/parent-data";

export default function fromParentWithChildrenToParent(parentDataWithChildren: ParentDataWithChildren) {
    return {
        id: parentDataWithChildren.id,
        email: parentDataWithChildren.email,
        familyName: parentDataWithChildren.familyName,
        givenName: parentDataWithChildren.givenName,
        phoneNumbers: parentDataWithChildren.phoneNumbers,
        address: parentDataWithChildren.address
    }
}