// React Resources
import { useState } from "react";

// MUI Resources
import { Button, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";

// Project Resources
import CenterForm from "../components/CenterForm";
import Form from "../components/Form";
import Nav from "../components/Nav";
import { mTheme } from "../resources/Themes";

// Firebase Resources
import { forgotPassword, resetPassword } from "../resources/Firebase";
import { useNavigate } from "react-router-dom";


export default function ForgotPassword(props) {
    const [ data, setData ] = useState({});
    const [ error, setError ] = useState();
    const [ success, setSuccess ] = useState(false);
    const [ sent, setSent ] = useState(false);

    const navigate = useNavigate();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return (
        <ThemeProvider theme={mTheme}>
            <CssBaseline />
            <Nav />
            <CenterForm>
                {urlParams.get('oobCode') ?
                    success ? 
                    <div>
                        <Typography 
                        variant='h5'
                        noWrap
                        sx={{
                            fontFamily: 'Quicksand',
                            mb: 3
                        }}
                        textAlign='center'
                        >
                            Success!
                        </Typography>
                        <Typography sx={{my: 2}}>
                            Your password has been successfully reset.
                            Click below to login
                        </Typography>
                        <Button variant="contained" onClick={() => {navigate('/dashboard')}} sx={{width: '100%'}}>
                            Login
                        </Button>
                    </div>
                    :
                    <div>
                        <Typography 
                        variant='h5'
                        noWrap
                        sx={{
                            fontFamily: 'Quicksand',
                            mb: 3
                        }}
                        textAlign='center'
                        >
                            Reset Password
                        </Typography>
                        <Form 
                        inputs={[
                            {
                            title: "New Password",
                            type: "password",
                            validate: "password",
                            required: true
                            },
                            {
                            title: "Confirm New Password",
                            type: "password",
                            validate: "confirm",
                            required: true
                            },
                        ]}
                        buttonText="Reset Password"
                        handleSubmit={() => {
                            resetPassword(urlParams.get('oobCode'), data.newpassword)
                                .then(() => {
                                    setSuccess(true)
                                })
                                .catch((e) => {
                                    setError(e.message)
                                })
                        }}
                        data={data}
                        setData={setData}
                        error={error}
                        />
                    </div>
                :
                    <div>
                        
                        {sent ?
                        <div>
                            <Typography 
                            variant='h5'
                            noWrap
                            sx={{
                                fontFamily: 'Quicksand'
                            }}
                            textAlign='center'
                            >
                                Link Sent!
                            </Typography>
                            <Typography sx={{mt: 2}}>
                                We just sent the email address <strong>{data.email}</strong> a 
                                password reset link. Check your email and 
                                click that link to return to this page.
                            </Typography>
                        </div>
                        :
                        <div>
                            <Typography 
                            variant='h5'
                            noWrap
                            sx={{
                                fontFamily: 'Quicksand'
                            }}
                            textAlign='center'
                            >
                                Reset Password
                            </Typography>
                            <Typography sx={{my: 2, mx: 1}}>
                                Type your email address and we will send you a reset link
                            </Typography>
                            <Form 
                            inputs={[
                                {
                                title: "Email",
                                type: "email",
                                placeholder: "example@gmail.com",
                                validate: "none",
                                required: true
                                },
                            ]}
                            buttonText="Send Reset Email"
                            handleSubmit={(event) => {
                                forgotPassword(data.email)
                                    .then(() => {
                                        setSent(true)
                                    })
                                    .catch((e) => {  
                                        setError(e.message)
                                    })
                            }}
                            data={data}
                            setData={setData}
                            error={error}
                            />
                        </div>
                        }
                    </div>
                }
            </CenterForm>
        </ThemeProvider>
    )
}