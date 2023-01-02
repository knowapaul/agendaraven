// React Resources
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// MUI Resources
import { Button, Typography } from "@mui/material"

// Project Resources
import Form from "./Form"
import CenterForm from "./CenterForm"
import Nav from './Nav';

// Firebase Resources
import { signInWithEmailAndPassword } from "firebase/auth"
import { getFirebase } from "../resources/Firebase"


function SignIn(auth, fields, setError) {
    signInWithEmailAndPassword(auth, fields.email, fields.password).then(
        out => {
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
        <div>
            <Nav />
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
                    SignIn(getFirebase().auth, fields, setError)
                }}
                data={fields}
                setData={setFields}
                formError={error}
                />
                <Button 
                variant="contained"
                onClick={() => {navigate('/createaccount')}}
                >
                    Create Account
                </Button>
            </CenterForm>
        </div>
    )
}