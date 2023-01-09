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
            <ThemeProvider theme={mTheme}>
                <CssBaseline />
                <Nav />
                <Paper sx={{margin: 2, padding: 2}}>
                    <Typography>
                        Sorry, you are not able to view this page. It might be an organization that you do not have permission to access,
                        or it might be an incorrectly typed link.
                    </Typography>
                </Paper>
            </ThemeProvider>
        )
    )
}