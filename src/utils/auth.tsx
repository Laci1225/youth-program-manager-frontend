import React, {createContext, useContext, ReactNode} from "react";

interface AuthContextProps {
    accessToken: string | undefined;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode; accessToken: string | undefined }> = ({
                                                                                                     children,
                                                                                                     accessToken
                                                                                                 }) => {
    return <AuthContext.Provider value={{accessToken}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
