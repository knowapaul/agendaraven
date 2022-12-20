import { useState } from "react";
import Form from "../components/Form";
import Nav from '../components/Nav'
import { Typography } from "@mui/material";
import CenterForm from "../components/CenterForm";
import { AuthContext } from "../resources/Auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addUserAccount } from "../resources/HandleDb";
import { DbContext } from "../resources/Db";
import { Link, useNavigate } from "react-router-dom";
import { FbContext } from "../resources/Firebase";
import { ArrowBack } from "@mui/icons-material";
import { Box } from "@mui/system";


function createNewAccount(auth, db, inData, navigate, setError) {
    let data = Object.assign({}, inData)
    createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCred) => {
            const displayName = data.firstname + ' ' + data.lastname;
            updateProfile(userCred.user, {displayName: displayName})
                .then(() => {
                    if (!data.schedulename) {
                        data.schedulename = data.firstname
                    }
                    
                    const acountInfo = {
                        schedulename: data.schedulename,
                        phonenumber: data.phonenumber
                    }
        
                    return addUserAccount(db, acountInfo, auth.currentUser)
                })
                .then(() => {
                    navigate('/dashboard')
                })
                .catch((error) => {
                    alert(`The following error occured while creating your account. 
                        It may affect the functionality of the site. ${error.message}`)
                })
        })
        .catch((error) => {
            setError(error.message)
        })
        
        
}

export default function CreateAccount() {
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const [error, setError] = useState()

    return (
        <div>
            <Nav />
            <CenterForm>
                <Link to='/dashboard'>
                    <Box sx={{mt: -2, ml: -1, verticalAlign:'middle', display: 'flex', flexWrap: 'wrap', alignItems: 'center',}}>
                        <ArrowBack fontSize="small" />
                        <Typography 
                        variant='body'
                        noWrap
                        textAlign='left'
                        sx={{margin: 0, padding: 0}}
                        >
                            Back to login
                        </Typography>
                    </Box>
                </Link>
                <Typography 
                variant='h5'
                noWrap
                sx={{
                    mt: -2,
                    fontFamily: 'Quicksand'
                }}
                textAlign='center'
                >
                    Create Account
                </Typography>
                <FbContext.Consumer>
                    {firebase => {
                        const auth = firebase.auth;
                        const db = firebase.db;
                        return (
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
                                    validate: 'schedule'
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
                            handleSubmit={() => {createNewAccount(auth, db, data, navigate, setError)}}
                            formError={error}
                            />
                        )

                    }}
                </FbContext.Consumer>

            </CenterForm>
        </div>
    )
}