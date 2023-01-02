// React Resources
import React from "react";
import { useAuthState } from 'react-firebase-hooks/auth';

// Project Resources
import Login from "./Login"
import Loading from "./Loading";

// Project Resources
import { getFirebase } from "../resources/Firebase";


export default function AuthCheck(props) {
    const [user, loading] = useAuthState(getFirebase().auth);

    return (
        loading ? <Loading /> :
        (
            user ? props.children
            :
            <Login />
        )
    )
}