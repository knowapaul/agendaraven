import { useState } from "react";
import Form from "../components/Form";
import Nav from '../components/Nav'
import { Typography } from "@mui/material";
import CenterForm from "../components/CenterForm";
import { AuthContext } from "../resources/Auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addUserAccount } from "../resources/HandleDb";
import { DbContext } from "../resources/Db";
import { useNavigate } from "react-router-dom";


function createNewAccount(auth, db, inData, navigate, setError) {
    let data = Object.assign({}, inData)
    createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCred) => {
            console.log(userCred)
            

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
                            )}
                        </DbContext.Consumer>
                    )}
                </AuthContext.Consumer>

            </CenterForm>
        </div>
    )
}