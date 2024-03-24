import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Pencil, Trash} from "lucide-react";
import {ReactNode} from "react";
import HoverText from "@/components/hoverText";
import {cn} from "@/lib/utils";

export interface DropdownItem {
    icon: ReactNode;
    label: ReactNode;
    onClick: () => void;
    hoverTextContent?: ReactNode;
    className?: string
}

interface SettingsDropdownProps {
    handleEditClick: () => void
    handleDeleteClick: () => void
    editPermission: string
    deletePermission: string
    additionalItems?: DropdownItem[]
    additionalItemsPermission?: string
}

const SettingsDropdown = ({
                              handleEditClick,
                              handleDeleteClick,
                              editPermission,
                              deletePermission,
                              additionalItems,
                              additionalItemsPermission
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
                    disabled={!editPermission}
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
                    disabled={!deletePermission}
                    onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        handleDeleteClick()
                    }}>
                    <Trash className="mx-1"/>
                    <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                {additionalItems?.map((item, index) => (
                    !!item.hoverTextContent ? (
                        <HoverText content={item.hoverTextContent} key={index}>
                            <DropdownMenuItem
                                className={cn("justify-center p-2 mx-5 my-1", item.className)}
                                disabled={!additionalItemsPermission}
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    item.onClick();
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </DropdownMenuItem>
                        </HoverText>
                    ) : (
                        <DropdownMenuItem
                            key={index}
                            className={cn("justify-center p-2 mx-5 my-1", item.className)}
                            disabled={!additionalItemsPermission}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                item.onClick();
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </DropdownMenuItem>
                    )
                ))}
            </DropdownMenuContent>

        </DropdownMenu>
    );
};

export default SettingsDropdown;
