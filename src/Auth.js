import { createContext, useState }  from 'react';

import { getAuth, onAuthStateChanged, connectAuthEmulator, authListener } from "firebase/auth";
import { UNSAFE_RouteContext } from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth'

export const AuthContext = createContext({});
export const UserContext = createContext({});

function update(f, value) {
    f(value)
}

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