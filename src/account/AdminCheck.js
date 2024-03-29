// React Resources
import React, { useEffect, useState } from "react";

// Project Resources
import { checkAdmin } from "../common/resources/Firebase";

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
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    checkAdmin(props.org, setIsAdmin);
  }, [props.org]);

  return <div>{isAdmin ? props.children : props.helperText}</div>;
}
