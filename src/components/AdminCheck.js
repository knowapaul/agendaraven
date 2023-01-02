// React Resources
import React, { useEffect, useState } from "react";

// Project Resources
import { checkAdmin } from "../resources/Firebase";


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

    useEffect(() => {
        checkAdmin(props.org, setIsAdmin)
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