// React Resources
import React, { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';

// Project Resources
import Login from "./Login"
import Loading from "./Loading";

// Firebase Resources
import { FbContext } from "../resources/Firebase";
import { checkAdmin } from "../resources/HandleDb";

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
    const [ isAdmin, setIsAdmin ] = useState()


    return (
        <FbContext.Consumer>
            {firebase => {
                if (isAdmin === undefined)  {
                    console.log('uid', firebase.auth.currentUser.uid)
                    checkAdmin(firebase.db, props.org, firebase.auth.currentUser.uid, setIsAdmin)
                }
                return (
                    <div>
                        {isAdmin 
                        ? 
                        props.children
                        :
                        <div>
                            {props.helperText}
                        </div>
                        }
                    </div>
                )
            }}  
        </FbContext.Consumer>
    )
}