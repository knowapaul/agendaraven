import { Paper, TextField, Button, Typography, CssBaseline, Container, Stack, Box } from "@mui/material"
import { mTheme } from "../Themes"
import { ThemeProvider } from "@emotion/react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Navigate, useNavigate } from "react-router-dom"
import Form from "./Form"
import { useState } from "react"
import { AuthContext } from "../Auth"
import CenterForm from "./CenterForm"


function SignIn(auth, fields) {
    console.log("attempting signin", auth, fields)
    signInWithEmailAndPassword(auth, fields.email, fields.password).then(
        out => {
            console.log('success!', auth.currentUser)
        }
    )
}

export default function Login(props) {
    const [fields, setFields] = useState({})
    const navigate = useNavigate();

    return (
        <CenterForm>
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
                        SignIn(auth, fields)
                        event.preventDefault()
                    }}
                    data={fields}
                    setData={setFields}
                    />
                )}
            </AuthContext.Consumer>
            <Button 
            variant="contained"
            onClick={() => {navigate('/createaccount')}}
            >
                Create Account
            </Button>
        </CenterForm>
    )
}