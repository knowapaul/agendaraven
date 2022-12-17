import { ThemeProvider, useTheme } from "@emotion/react";
import { Paper, Backdrop, Typography, Button, ClickAwayListener, Box, IconButton } from "@mui/material";

import { useState } from "react";

import { mTheme } from '../resources/Themes'
import CenterForm from "./CenterForm";
import Form from "./Form";

import { CancelOutlined, Close } from "@mui/icons-material";
import { FbContext } from "../resources/Firebase";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getUserData } from "../resources/HandleDb";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { create } from "@mui/material/styles/createTransitions";
import { useNavigate } from "react-router-dom";



export default function CreateOrJoin(props) {
    const [open, setOpen] = useState(false);
    const [cFields, setCFields] = useState({});
    const [jFields, setJFields] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    
    const handleClose = () => {
      setOpen(false);
    };
    const handleToggle = () => {
      setOpen(!open);
    };

    const newOrg = async (db, auth, cFunc) => {
        // TODO: Perform checks here
        console.log('db, auth.currentUser.uid', db, auth.currentUser.uid)
        const data = await getUserData(db, auth.currentUser.uid)
        const orgName = cFields.nameyourorganization;

        console.log('new')
        const time = await cFunc({ 
            orgName: orgName, 
            phonenumber: data.info.phonenumber, 
            schedulename: data.info.schedulename 
        })
        console.log('Organization created at:', time)
        navigate(`/${orgName}`)
        
    }

    return (
        <ThemeProvider theme={mTheme}>
            <FbContext.Consumer>
                {firebase => {
                    const functions = firebase.functions
                    const db = firebase.db;
                    const auth = firebase.auth;

                    const createOrganization = httpsCallable(functions, 'createOrganization');
                    console.log(createOrganization)

                    return (
                        <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={props.open}
                        >
                            {props.open ?
                                <ClickAwayListener onClickAway={() => {props.setOpen(false)}}>
                                <Paper
                                sx={{padding: 3, pt: 0, backgroundColor: theme.palette.secondary.main}}
                                >   
                                    <IconButton onClick={() => {props.setOpen(false)}}>
                                    <CancelOutlined />
                                    </IconButton>
                                    
                                    <Paper sx={{padding: 3, backgroundColor: theme.palette.primary}}>

                                        <Typography
                                        variant='h6'
                                        textAlign='center'
                                        mb={3}
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
                                        buttonText="Continue to Organiztion Home"
                                        handleSubmit={(event) => {
                                            event.preventDefault()
                                        }}
                                        data={jFields}
                                        setData={setJFields}
                                        formError={error}
                                        />
                                    </Paper>
                                    <Typography
                                    variant='h5'
                                    textAlign='center'
                                    color={theme.palette.primary.main}
                                    margin={3}
                                    >
                                        OR Create One
                                    </Typography>
                                    <Paper sx={{padding: 3, backgroundColor: theme.palette.primary}}>
                                        <Typography
                                        variant='h5'
                                        textAlign='center'
                                        margin={3}
                                        >
                                            Create Organization
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
                                        formError={error}
                                        />
                                    </Paper>
                                </Paper>
                            </ClickAwayListener> : '' }
                        </Backdrop>
                    )
                }}
            </FbContext.Consumer>

        </ThemeProvider>
    )
}