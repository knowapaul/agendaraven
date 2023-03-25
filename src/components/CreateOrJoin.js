// React Resources
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { Paper, Typography, Divider, Backdrop, CircularProgress, Stack, Box } from "@mui/material";

// Project Resources
import Form from "./Form";
import PopupForm from "./PopupForm";
import { mTheme } from '../resources/Themes'
import { getFirebase, getUserData, reloadAllDocs } from "../resources/Firebase";

// Firebase Resources
import { httpsCallable } from "firebase/functions";



export default function CreateOrJoin(props) {
    const [ cFields, setCFields ] = useState({nameyourorganization: ''});
    const [ jFields, setJFields ] = useState({organizationname: '', joincode: ''});
    const [ cError, setCError ] = useState('');
    const [ jError, setJError ] = useState('');

    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    const firebase = getFirebase();
    const functions = firebase.functions
    const db = firebase.db;
    const auth = firebase.auth;

    const createOrganization = httpsCallable(functions, 'createOrganization');
    const joinOrganization = httpsCallable(functions, 'joinOrganization');

    const handleCreate = async () => {
        setLoading(true)
        
        // TODO: Perform checks here
        const data = await getUserData(auth.currentUser.uid)

        // Wipe the current organizations that have just been read
        reloadAllDocs();

        const orgName = cFields.nameyourorganization;

        console.log('executing...')

        await createOrganization({ 
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

    const handleJoin = async () => {
        setLoading(true)
        
        // TODO: Perform checks here
        const data = await getUserData(db, auth.currentUser.uid)

        // Wipe the current organizations that have just been read
        reloadAllDocs();

        const orgName = jFields.organizationname;
        const joinCode = jFields.joincode;

        joinOrganization({ 
                orgName: orgName, 
                joinCode: joinCode.toUpperCase(),
                phonenumber: data.info.phonenumber, 
                schedulename: data.info.schedulename 
            })
            .then((e) => {
                console.log('EEE', e)

                if (e.data) {
                    console.error(e.data.error);
                    setJError(e.data.error);
                    setLoading(false);
                } else {
                    setLoading(false);
                    navigate(`/${orgName}/home`);
                }
            })        
    }

    console.log('jfields', jFields)


    return (
        <ThemeProvider theme={mTheme}>
            { loading ? 
            <Backdrop
            sx={{ zIndex: mTheme.zIndex.drawer + 1 }}
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
            <PopupForm width={'350px'} open={props.open} setOpen={props.setOpen} title="Create or Join">
                <Paper sx={{padding: 2, backgroundColor: mTheme.palette.primary}}>
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
                    handleSubmit={handleJoin}
                    data={jFields}
                    setData={setJFields}
                    formError={jError}
                    />
                </Paper>
                <Divider sx={{margin: 2, }}/>
                <Paper sx={{padding: 2, backgroundColor: mTheme.palette.primary, }}>
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
                    handleSubmit={handleCreate}
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