import { Paper, TextField, Button, Typography, CssBaseline, Container, Stack, Box } from "@mui/material"
import { mTheme } from "../Themes"
import { ThemeProvider } from "@emotion/react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Navigate, useNavigate } from "react-router-dom"
import Form from "./Form"
import { useState } from "react"
import { AuthContext } from "../Auth"


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
        <ThemeProvider theme={mTheme}>
            <CssBaseline />
            <Paper
            variant="outlined"
            sx={{
                maxWidth: 400,
                mx: 'auto', // margin left & right
                my: 4, // margin top & botom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                mt: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
            }}
            >
                <Container>
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
                </Container>
                <AuthContext.Consumer>
                    {auth => (
                        <Form 
                        inputs={[
                            {title: "Email",
                            type: "email",
                            placeholder: "example@gmail.com"},
                            {title: "Password",
                            type: "password",
                            placeholder: ""},
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
        </Paper>
            
        </ThemeProvider>
    )
}