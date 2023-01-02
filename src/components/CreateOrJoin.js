// React Resources
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Resources
import { ThemeProvider, useTheme } from "@emotion/react";
import { Paper, Typography, Divider } from "@mui/material";

// Project Resources
import Form from "./Form";
import PopupForm from "./PopupForm";
import { mTheme } from '../resources/Themes'
import { getFirebase, getUserData } from "../resources/Firebase";

// Firebase Resources
import { httpsCallable } from "firebase/functions";



export default function CreateOrJoin(props) {
    const [ cFields, setCFields ] = useState({});
    const [ jFields, setJFields ] = useState({});
    const [ cError, setCError ] = useState('');
    const [ jError, setJError ] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    const newOrg = async (db, auth, cFunc) => {
        // TODO: Perform checks here
        const data = await getUserData(auth.currentUser.uid)
        const orgName = cFields.nameyourorganization;

        const e = await cFunc({ 
            orgName: orgName, 
            phonenumber: data.info.phonenumber, 
            schedulename: data.info.schedulename 
        })
        console.log('error', e)
        if (e.data) {
            setCError(e.data)
        } else {
            navigate(`/${orgName}/home`)
        }
        
    }

    const joinOrg = async (db, auth, jFunc) => {
        // TODO: Perform checks here
        const data = await getUserData(db, auth.currentUser.uid)
        const orgName = jFields.organizationname;
        const joinCode = jFields.joincode;

        const time = await jFunc({ 
            orgName: orgName, 
            joinCode: joinCode.toUpperCase(),
            phonenumber: data.info.phonenumber, 
            schedulename: data.info.schedulename 
        })
        console.log('Organization created at:', time)
        navigate(`/${orgName}/home`)
        
    }

    const firebase = getFirebase();
    const functions = firebase.functions
    const db = firebase.db;
    const auth = firebase.auth;

    const createOrganization = httpsCallable(functions, 'createOrganization');
    const joinOrganization = httpsCallable(functions, 'joinOrganization');

    return (
        <ThemeProvider theme={mTheme}>
            <PopupForm open={props.open} setOpen={props.setOpen} title="Create or Join">
                <Paper sx={{padding: 2, backgroundColor: theme.palette.primary}}>
                    <Typography
                    variant='h6'
                    textAlign='center'
                    sx={{mb: 2}}
                    >
                        Join an Organization
                    </Typography>
                    <Form 
                    inputs={[
                        {
                        title: "Organization Name",
                        type: "text",
                        placeholder: "",
                        validate: "none",
                        required: true
                        },
                        {
                        title: "Join Code",
                        type: "text",
                        placeholder: "AAA####",
                        validate: "none",
                        required: true
                        },
                    ]}
                    buttonText="Continue to Organiztion"
                    handleSubmit={(event) => {
                        joinOrg(db, auth, joinOrganization)
                    }}
                    data={jFields}
                    setData={setJFields}
                    formError={jError}
                    />
                </Paper>
                <Divider sx={{margin: 2}}/>
                <Paper sx={{padding: 2, backgroundColor: theme.palette.primary}}>
                    <Typography
                    variant='h6'
                    textAlign='center'
                    sx={{mb: 2}}
                    >
                        Create an Organization
                    </Typography>
                    <Form 
                    inputs={[
                        {
                        title: "Name Your Organization",
                        type: "text",
                        placeholder: "Letters and numbers only",
                        validate: "title",
                        required: true
                        },
                    ]}
                    buttonText="Create!"
                    handleSubmit={(event) => {
                        newOrg(db, auth, createOrganization)
                    }}
                    data={cFields}
                    setData={setCFields}
                    formError={cError}
                    />
                </Paper>
            </PopupForm>
        </ThemeProvider>
    )
}