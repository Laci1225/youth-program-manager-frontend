import {httpRequest} from "@/pages/api/common";
import {ChildData} from "@/model/child-data";

export function getChildren(){
    return httpRequest.get<ChildData[]>("/children")
        .then(value => value.data)
}