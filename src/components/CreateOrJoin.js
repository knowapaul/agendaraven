// React Resources
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Resources
import { ThemeProvider, useTheme } from "@emotion/react";
import { Paper, Typography, Divider, Backdrop, CircularProgress, Stack, Box } from "@mui/material";

// Project Resources
import Form from "./Form";
import PopupForm from "./PopupForm";
import { mTheme } from '../resources/Themes'
import { getFirebase, getUserData, reloadAllDocs } from "../resources/Firebase";

// Firebase Resources
import { httpsCallable } from "firebase/functions";



export default function CreateOrJoin(props) {
    const [ cFields, setCFields ] = useState({});
    const [ jFields, setJFields ] = useState({});
    const [ cError, setCError ] = useState('');
    const [ jError, setJError ] = useState('');

    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();

    const newOrg = async (db, auth, cFunc) => {
        setLoading(true)
        
        // TODO: Perform checks here
        const data = await getUserData(auth.currentUser.uid)

        // Wipe the current organizations that have just been read
        reloadAllDocs();

        const orgName = cFields.nameyourorganization;

        console.log('executing...')

        await cFunc({ 
                orgName: orgName, 
                phonenumber: data.info.phonenumber, 
                schedulename: data.info.schedulename 
            })
            .then((e) => {
                if (e.data) {
                    console.error(e.data);
                    setCError(e.data);
                    setLoading(false);
                } else {
                    setLoading(false);
                    navigate(`/${orgName}/home`);
                }
            })        
    }

    const joinOrg = async (db, auth, jFunc) => {
        setLoading(true)
        
        // TODO: Perform checks here
        const data = await getUserData(db, auth.currentUser.uid)

        // Wipe the current organizations that have just been read
        reloadAllDocs();

        const orgName = jFields.organizationname;
        const joinCode = jFields.joincode;

        await jFunc({ 
                orgName: orgName, 
                joinCode: joinCode.toUpperCase(),
                phonenumber: data.info.phonenumber, 
                schedulename: data.info.schedulename 
            })
            .then((e) => {
                if (e.data) {
                    console.error(e.data);
                    setJError(e.data);
                    setLoading(false);
                } else {
                    setLoading(false);
                    navigate(`/${orgName}/home`);
                }
            })        
    }

    const firebase = getFirebase();
    const functions = firebase.functions
    const db = firebase.db;
    const auth = firebase.auth;

    const createOrganization = httpsCallable(functions, 'createOrganization');
    const joinOrganization = httpsCallable(functions, 'joinOrganization');

    return (
        <ThemeProvider theme={mTheme}>
            { loading ? 
            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
            >
                <Stack spacing={3}>
                    <Typography>
                        Please wait while your action is executed...
                    </Typography>
                    <Box
                    display='flex'
                    justifyContent={'center'}
                    alignContent={'center'}
                    >
                        <CircularProgress color="inherit" sx={{width: '100%'}}/>
                    </Box>
                </Stack>
            </Backdrop>
            :
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
                        validate: "document",
                        required: true
                        },
                        {
                        title: "Join Code",
                        type: "text",
                        placeholder: "#######",
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
                <Paper sx={{padding: 2, backgroundColor: theme.palette.primary, display: 'none'}}>
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
                        validate: "document",
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
            }
        </ThemeProvider>
    )
}