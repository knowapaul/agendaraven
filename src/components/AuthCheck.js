import React from "react";
import { FbContext } from "../resources/Firebase";
import Login from "./Login"
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from "./Loading";

export default function AuthCheck(props) {
    return (
        <FbContext.Consumer>
            {firebase => {
                const auth = firebase.auth;
                return (
                    <Internal auth={auth}>{props.children}</Internal>
                )
            }}  
        </FbContext.Consumer>
    )
}

function Internal(props) {
    const [user, loading] = useAuthState(props.auth);

    return (
        loading ? <Loading /> :
        (
            user ? props.children
            :
            <Login />
        )
    )
}