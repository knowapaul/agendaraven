import { ThemeProvider, useTheme } from "@emotion/react";
import { Paper, Backdrop, Typography, Button, ClickAwayListener, Box, IconButton } from "@mui/material";

import { useState } from "react";

import { mTheme } from '../resources/Themes'
import CenterForm from "./CenterForm";
import Form from "./Form";

import { CancelOutlined, Close } from "@mui/icons-material";



export default function CreateOrJoin(props) {
    const [open, setOpen] = useState(false);
    const [fields, setFields] = useState({});
    const [error, setError] = useState('');
    const theme = useTheme();
    
    const handleClose = () => {
      setOpen(false);
    };
    const handleToggle = () => {
      setOpen(!open);
    };

    return (
        <ThemeProvider theme={mTheme}>
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
                            data={fields}
                            setData={setFields}
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
                                validate: "none",
                                required: true
                                },
                            ]}
                            buttonText="Create!"
                            handleSubmit={(event) => {
                                event.preventDefault()
                            }}
                            data={fields}
                            setData={setFields}
                            formError={error}
                            />
                        </Paper>
                    </Paper>
                </ClickAwayListener> : '' }
            </Backdrop>
        </ThemeProvider>
    )
}