// React Resources
import React, { useEffect } from "react";
import { useState } from "react";

// Project Resources
import Loading from "./Loading";

// Project Resources
import { CssBaseline, Paper, Typography } from "@mui/material";
import { getUserData } from "../resources/Firebase";
import Nav from "./Nav";
import { ThemeProvider } from "@emotion/react";
import { bTheme, mTheme } from "../resources/Themes";
import Error404 from "./404";


export default function OrgCheck(props) {
    const [ orgs, setOrgs ] = useState();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        getUserData().then((data) => {setOrgs(data.orgs); setLoading(false)})
    })

    return (
        loading ? <Loading /> :
        (
            Object.keys(orgs).includes(props.org) ? props.children
            :
            <Error404 />
        )
    )
}