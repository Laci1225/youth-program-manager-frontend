import {createContext, Dispatch, SetStateAction} from "react";

const PermissionContext = createContext<{
    permissions: string[],
    setPermissions: Dispatch<SetStateAction<string[]>>
}>(undefined as any);
export default PermissionContext;