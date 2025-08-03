"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";


interface SessionContext {
    user: User;
    session: Session;
}


const sessionContext = createContext< SessionContext | null >(null);


export default function SessionProvider ({
    children,
    value
}: React.PropsWithChildren<{ value: SessionContext }>) {
     return (
        
     <sessionContext.Provider
       value={value}
     >
        { children }
     </sessionContext.Provider>

     )
}



export const useSession = () => {
    const context = useContext(sessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
