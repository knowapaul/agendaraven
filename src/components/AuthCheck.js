import { onAuthStateChanged } from "firebase/auth";
import React, { useState } from "react";
import { UserContext } from "../Auth";
import Login from "./Login"
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AuthCheck(props) {
    return (
        <UserContext.Consumer>
            {user => (
                user ? props.children : <Login />
            )}
        </UserContext.Consumer>
    )
}