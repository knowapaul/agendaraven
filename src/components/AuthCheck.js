import { onAuthStateChanged } from "firebase/auth";
import React, { useState } from "react";
import { AuthContext } from "../Auth";
import Login from "./Login"
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from "./Loading";

export default function AuthCheck(props) {
    return (
        <AuthContext.Consumer>
            {auth => (
                <Internal auth={auth}>{props.children}</Internal>
            )}
        </AuthContext.Consumer>
    )
}

function Internal(props) {
    const [user, loading, error] = useAuthState(props.auth);

    return (
        loading ? <Loading /> :
        (
            user ? props.children
            :
            <Login />
        )
    )
}