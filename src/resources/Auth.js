import { createContext }  from 'react';

import { getAuth, connectAuthEmulator } from "firebase/auth";

import { useAuthState } from 'react-firebase-hooks/auth'

export const AuthContext = createContext({});
export const UserContext = createContext({});


export function Auth(props) {
    const auth = getAuth(props.app);
    connectAuthEmulator(auth, "http://localhost:9099")
    
    return (
        <Internal auth={auth}>
            {props.children}
        </Internal>
    )
}

function Internal(props) {
    const [user, loading, error] = useAuthState(props.auth);

    return (
        <AuthContext.Provider value={props.auth}>
            <UserContext.Provider value={user}>
                {props.children}
            </UserContext.Provider>
        </AuthContext.Provider>
    )
}