// React Resources
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Project Resources
import Loading from "../common/load/Loading";
import Login from "./Login";

// Project Resources
import { getFirebase } from "../common/resources/Firebase";

export default function AuthCheck(props) {
  const [user, loading] = useAuthState(getFirebase().auth);

  return (
    <Loading state={loading} text="Checking Login..." dark>
      {user ? props.children : <Login />}
    </Loading>
  );
}
