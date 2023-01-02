// React Resources
import React, { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';

// Project Resources
import Login from "./Login"
import Loading from "./Loading";

// Firebase Resources
import { FbContext } from "../resources/Firebase";
import { checkAdmin } from "../resources/HandleDb";



function Internal(props) {
    const [ isAdmin, setIsAdmin ] = useState()

    useEffect(() => {
        checkAdmin(props.firebase.db, props.org, props.firebase.auth.currentUser.uid, setIsAdmin)
    }, [])
    
    return (
        <div>
            {
                isAdmin 
                ? 
                props.children
                :
                <div>
                    {props.helperText}
                </div>
            }
        </div>
    )
}
/**
 * ## Admin Check Component
 * 
 * Ensures that users viewing component children are administrators.
 * 
 * @param  {Map} props React Props
 * - helperText = {String} Text to display if the user is not an admin
 * - org = {String} The organization the user belongs to
 */
export default function AdminCheck(props) {

    return (
        <FbContext.Consumer>
            {firebase => {
                <Internal firebase={firebase} {...props}>
                    {props.children}
                </Internal>
            }}  
        </FbContext.Consumer>
    )
}