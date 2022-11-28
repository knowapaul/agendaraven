import { Button, Typography } from "@mui/material"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import Form from "./Form"
import { useState } from "react"
import { FbContext } from '../resources/Firebase'
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
            console.log(message)
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
            <FbContext.Consumer>
                {firebase => {
                    const auth = firebase.auth;
                    return (
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
                        }}
                        data={fields}
                        setData={setFields}
                        formError={error}
                        />
                    )
                }}
            </FbContext.Consumer>
            <Button 
            variant="contained"
            onClick={() => {navigate('/createaccount')}}
            >
                Create Account
            </Button>
        </CenterForm>
    )
}