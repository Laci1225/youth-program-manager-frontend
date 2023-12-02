import {ChildData} from "@/model/child-data";
import deleteChild from "@/api/graphql/deleteChild";
import {toast} from "@/components/ui/use-toast";
import React from "react";
import ConformDialog from "@/components/conformDialog";
import {useRouter} from "next/router";

interface deleteChildProps {
    child: ChildData,
    children?: ChildData[]
    setChildren?: React.Dispatch<React.SetStateAction<ChildData[]>>
}

export default function DeleteChild({child, children, setChildren}: deleteChildProps) {
    const router = useRouter()
    const handleDelete = async () => {
        try {
            const deletedChild = await deleteChild(child.id);
            toast({
                variant: "default",
                title: "Child data deleted successfully",
                description: `${deletedChild.givenName} ${deletedChild.familyName} deleted`
            });
            if (children && setChildren) {
                const updatedChildren = children.filter(c => c.id !== child.id);
                setChildren(updatedChildren);
            } else
                router.push('/children');

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error occurred: " + error,
                description: `Child data with name: ${child.givenName} ${child.familyName} could not be deleted`
            });
        }
    }
    return (
        <ConformDialog buttonName={<span className="material-icons-outlined">delete</span>}
                       dialogTitle={"Are you absolutely sure?"}
                       dialogDescription={"This action cannot be undone. This will permanently delete your" +
                           " account and remove your data from our servers."}
                       onClickAction={handleDelete}/>)
};
