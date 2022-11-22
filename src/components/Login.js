import { Paper, TextField, Button, Typography, CssBaseline, Container, Stack, Box, Alert, AlertTitle } from "@mui/material"
import { mTheme } from "../pages/Themes"
import { ThemeProvider } from "@emotion/react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Navigate, useNavigate } from "react-router-dom"
import Form from "./Form"
import { useState } from "react"
import { AuthContext } from "../resources/Auth"
import CenterForm from "./CenterForm"
import Nav from './Nav';


function SignIn(auth, fields, setError) {
    console.log("attempting signin", auth, fields)
    signInWithEmailAndPassword(auth, fields.email, fields.password).then(
        out => {
            console.log('success!', auth.currentUser)
        }
    ).catch((error) => {
        let message = error.message;

        if (message.includes('wrong-password') || message.includes('user-not-found')) {
            message = <div>
                        <strong>Incorrect credentials.</strong> Please double check your spelling. Passwords are case sensitive.
                    </div>
        }

        setError(message)
    })
}

export default function Login(props) {
    const [fields, setFields] = useState({})
    const [error, setError] = useState('')
    const navigate = useNavigate();

    return (
        <CenterForm>
            <Nav />
            <Typography 
            variant='h5'
            noWrap
            sx={{
                fontFamily: 'Quicksand'
            }}
            textAlign='center'
            >
                Login
            </Typography>
            <AuthContext.Consumer>
                {auth => (
                    <Form 
                    inputs={[
                        {
                        title: "Email",
                        type: "email",
                        placeholder: "example@gmail.com",
                        validate: "none",
                        required: true
                        },
                        {
                        title: "Password",
                        type: "password",
                        placeholder: "",
                        validate: "none",
                        required: true
                        },
                    ]}
                    buttonText="Continue to Dashboard"
                    handleSubmit={(event) => {
                        SignIn(auth, fields, setError)
                        event.preventDefault()
                    }}
                    data={fields}
                    setData={setFields}
                    />
                )}
            </AuthContext.Consumer>
            {error ?
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
                : ''
            }
            <Button 
            variant="contained"
            onClick={() => {navigate('/createaccount')}}
            >
                Create Account
            </Button>
        </CenterForm>
    )
}