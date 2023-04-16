// React Resources
import React, { useEffect, useState } from "react";

// Project Resources
import Loading from "../common/load/Loading";

// Project Resources
import { getUserData } from "../common/resources/Firebase";
import Error404 from "../common/errors/404";
import { FriendlyError } from "../common/errors/Error";

export default function OrgCheck(props) {
  const [orgs, setOrgs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getUserData()
      .then((data) => {
        setOrgs(data.orgs);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  });

  function generateErrorMessage(error) {
    if (error.message?.toLowerCase().includes("offline")) {
      return {
        title: "Connection offline",
        text: "You appear to be offline. Please check your connection and try again.",
      };
    } else {
      return {
        title: "An unknown error has occured",
        text: String(error),
      };
    }
  }
  console.log("loading oc", loading);

  return (
    <Loading state={loading} text="Checking Organization..." dark>
      {Object.keys(orgs).includes(props.org) || loading ? (
        props.children(loading)
      ) : error ? (
        <FriendlyError {...generateErrorMessage(error)} />
      ) : (
        <Error404 />
      )}
    </Loading>
  );
}
