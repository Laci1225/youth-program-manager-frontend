import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Pencil, Trash} from "lucide-react";
import {ReactNode} from "react";

interface SettingsDropdownProps {
    handleEditClick: () => void
    handleDeleteClick: () => void
    additionalItem?: ReactNode;
}

const SettingsDropdown = ({
                              handleEditClick,
                              handleDeleteClick,
                              additionalItem
                          }: SettingsDropdownProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger onClick={event => event.preventDefault()}>
                <span className="material-icons-outlined">more_horiz</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-8">
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className="justify-center hover:cursor-pointer p-2 mx-5 my-1"
                    onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        handleEditClick()
                    }}>
                    <Pencil className="mx-1"/>
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="justify-center hover:cursor-pointer p-2 mx-5 bg-red-600 text-white my-1"
                    onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        handleDeleteClick()
                    }}>
                    <Trash className="mx-1"/>
                    <span>Delete</span>
                </DropdownMenuItem>
                {additionalItem}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SettingsDropdown;
