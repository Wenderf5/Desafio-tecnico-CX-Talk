import { createContext, useContext, useState } from "react";

interface user {
    id: string;
    name: string;
    photo: string;
}

interface userContextInterface {
    user: user | null,
    setUser: React.Dispatch<React.SetStateAction<user | null>>;
}

const UserContext = createContext<userContextInterface | null>(null);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<user | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("Error in context 'userContext'.");
    }
    return context;
}