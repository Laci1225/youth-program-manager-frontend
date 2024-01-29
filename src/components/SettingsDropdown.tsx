import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Pencil, Trash} from "lucide-react";

interface SettingsDropdownProps {
    handleEditClick: () => void
    handleDeleteClick: () => void
}

const SettingsDropdown = ({
                              handleEditClick,
                              handleDeleteClick,
                          }: SettingsDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={event => event.preventDefault()}>
                <span className="material-icons-outlined">more_horiz</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"min-w-8"}>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className={"justify-center hover:cursor-pointer"}
                    onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        handleEditClick()
                    }}>
                    <Pencil className={"mx-1"}/>
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className={"justify-center hover:cursor-pointer p-2 mx-5 bg-red-600 text-white"}
                    onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        handleDeleteClick()
                    }}>
                    <Trash className={"mx-1"}/>
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SettingsDropdown;
