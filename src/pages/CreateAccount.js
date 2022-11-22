import { ThemeProvider } from "@emotion/react";
import { useState } from "react";
import Form from "../components/Form";
import { bTheme } from "./Themes";
import Nav from '../components/Nav'
import { CssBaseline, Typography } from "@mui/material";
import CenterForm from "../components/CenterForm";
import { AuthContext } from "../resources/Auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addUserAccount } from "../resources/HandleDb";
import { DbContext } from "../resources/Db";
import { useNavigate } from "react-router-dom";


function createNewAccount(auth, db, data, navigate) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
            delete data.email;
            delete data.password;
            delete data.confirmpassword;

            addUserAccount(db, data, auth.currentUser)
                .then(() => {
                    navigate('/dashboard')
                })
                .catch((error) => {
                    alert(error)
                });
        })
        .catch((error) => {
            alert(error)
        })
}

export default function CreateAccount() {
    const [data, setData] = useState({});
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
                    Create Account
                </Typography>
                <AuthContext.Consumer>
                    {auth => (
                        <DbContext.Consumer>
                            {db => (
                                <Form 
                                inputs={[
                                    {
                                        title: 'Email',
                                        type: 'email',
                                        placeholder: 'johndoe@example.com',
                                        required: true,
                                        validate: 'email'
                                    },
                                    {
                                        title: 'Phone Number',
                                        type: 'phone',
                                        placeholder: '(000) 000-0000',
                                        required: true,
                                        validate: 'phone'
                                    },
                                    {
                                        title: 'First Name',
                                        type: 'text',
                                        placeholder: 'Johnathan',
                                        required: true,
                                        validate: 'title'
                                    },
                                    {
                                        title: 'Last Name',
                                        type: 'text',
                                        placeholder: 'Doe',
                                        required: true,
                                        validate: 'title'
                                    },
                                    {
                                        title: 'Schedule Name',
                                        type: 'text',
                                        placeholder: 'John',
                                        validate: 'title'
                                    },
                                    {
                                        title: 'Password',
                                        type: 'password',
                                        placeholder: 'Longer than 8 characters',
                                        required: true,
                                        validate: 'password'
                                    },
                                    {
                                        title: 'Confirm Password',
                                        type: 'password',
                                        placeholder: 'Retype password',
                                        required: true,
                                        validate: 'confirm'
                                    },
                                ]}
                                buttonText="Continue to Dashboard"
                                data={data}
                                setData={setData}
                                handleSubmit={() => {createNewAccount(auth, db, data, navigate)}}
                                />
                            )}
                        </DbContext.Consumer>
                    )}
                </AuthContext.Consumer>
            </CenterForm>
        </div>
    )
}