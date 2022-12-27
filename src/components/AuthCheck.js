// React Resources
import React from "react";
import { useAuthState } from 'react-firebase-hooks/auth';

// Project Resources
import Login from "./Login"
import Loading from "./Loading";

// Firebase Resources
import { FbContext } from "../resources/Firebase";


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