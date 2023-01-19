// React Resources
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// MUI Resources
import { ArrowBack } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

// Project Resources
import CenterForm from "../components/CenterForm";
import Form from "../components/Form";
import Nav from '../components/Nav';
import { createNewAccount } from "../resources/Firebase";

// Firebase Resources


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
                handleSubmit={() => {createNewAccount(data, navigate, setError)}}
                formError={error}
                />
            </CenterForm>
        </div>
    )
}