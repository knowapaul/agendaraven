// React Resources
import { useState } from "react"
import { useDocument } from 'react-firebase-hooks/firestore';

// MUI Resources
import { Stack, Paper, Box, Typography, Avatar, Button } from "@mui/material"
import { ArrowBack, Visibility } from "@mui/icons-material";

// Project Resources
import { FbContext } from '../resources/Firebase'
import { getRolesDoc } from "../resources/HandleDb";
import Form from "../components/Form";
import UserSearch from "../components/UserSearch";
import Cards from "../components/Cards";

// Firebase Resources
import { httpsCallable } from "firebase/functions";


function User(props) {
    let full, nameText, first, last, data;
    if (Object.keys(props.selected)[0]) {
        full = Object.keys(props.selected)[0]
        nameText = full.split(' ');
        first = nameText[0][0].toUpperCase() + nameText[0].slice(1);
        last = nameText[1][0].toUpperCase() + nameText[1].slice(1);
        data = props.selected[full];
    }

    return (
        <div>
            {
            props.setSelected ? 
            <Button 
            onClick={() => {props.setSelected({})}}
            variant='contained'
            sx={{m: 1}}
            >
                <ArrowBack sx={{mr: 1}}/>
                <Typography
                noWrap
                >
                    Back
                </Typography>
            </Button> :
            ''
            }
            <Paper width={10} sx={{m: 1, p: 2, minHeight: 200}}>
                {Object.keys(props.selected)[0] ? 
                    <div>
                        <Stack direction='row' spacing={1}>
                            <Avatar sx={{margin: 'auto', mx: 0}}/>
                            <Box>
                                <Typography variant='body1' sx={{fontWeight: 'bold'}}>
                                    {first}
                                </Typography>
                                <Typography variant='body1' sx={{fontWeight: 'bold'}}>
                                    {last}
                                </Typography>
                            </Box>
                        </Stack>
                        <Typography m={1}>
                            {data.roles ? `Role${data.roles.length > 1 ? 's' : ''}: ` +  data.roles.join(', ') : ''}
                        </Typography>
                        <Typography m={1}>
                            {data.email ? "Email: " + data.email : ''}
                        </Typography>
                        <Button variant="contained" color="secondary">
                            {data.schedulename ? `Send a chat message to ${data.schedulename}` : ''}
                        </Button>
                    </div>
                    :
                    <Stack direction={'row'}>
                        <ArrowBack sx={{mr: 1}}/>
                        <Typography>
                            
                            Click on a user to see more information about them
                        </Typography>
                    </Stack>
                }
            </Paper>
        </div>
    )
}

function getCode() {
    const alphabet = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let out = ''
    for (let i = 0; i < 7; i++) {
        out += alphabet[Math.floor(Math.random()*36)]
    }
    return out;
}

function Roles(props) {
    const db = props.firebase.db;
    const functions = props.firebase.functions;

    const [ rolesDoc, loading ]= useDocument(getRolesDoc(db, props.org));
    const [ formData, setFormData ] = useState({});
    const [ formOpen, setFormOpen ] = useState(false);
    const addRole = httpsCallable(functions, 'addRole');
    const data = rolesDoc ? rolesDoc.data() : false;

    const NewForm = () => {
        const key = getCode()
        return (
            <Form 
            inputs={[
                {title: 'Role Name',
                type: 'text',
                placeholder: '',
                required: true,
                validate: 'role'
                },
                {title: 'Role Description',
                type: 'text',
                placeholder: '',
                required: true,
                validate: 'none',
                multiline: true,
                }
            ]}
            data={formData} 
            setData={setFormData} 
            buttonText={'Add'} 
            handleSubmit={() => {
                addRole(
                    {
                    orgName: props.org,
                    roleName: formData.rolename, 
                    roleKey: key, 
                    roleDescription: formData.roledescription
                    }
                ).then(
                    setFormOpen(false)
                )
            }}
            >
                <Typography>
                    {`Key: ${key.slice(0, 3)} - ${key.slice(3)}`}
                </Typography>
            </Form>
        )
    }

    return (
        <Cards
        data={data ? Object.keys(data).map((key) => {
            return (
                {
                    title: data[key].roleName,
                    subtitle: `Key: ${key.slice(0, 3)} - ${key.slice(3)}`,
                    description: data[key].roleDescription
                }
            )})
            :
            {}
        }
        helperMessage={"You currently have no roles in your organization. Click 'Add Role' to begin."}
        form={<NewForm />}
        formTitle={"Add Role"}
        loading={loading}
        open={formOpen}
        setOpen={setFormOpen}
        back={{
            handleBack: () => {props.setWidget('users')},
            tooltip: 'Back to People',
        }}
        add={{
            text: 'Add Role',
            tooltip: 'Add a New Role',
        }}
        title={"Roles"}
        />
    )
}

export default function People(props) {
    const [ widget, setWidget ] = useState('users')
    const [ selected, setSelected ] = useState({});

    const RoleButton = () => (
        <Button 
        variant="contained" 
        sx={{ ml: 2, flex: 1}}
        onClick={() => {setWidget('roles')}}
        >
            <Visibility sx={{mr: 1}} />
                Roles
        </Button>
    )
    
    return (
        <FbContext.Consumer>
            {firebase => (
                widget === 'roles' ? 
                <Roles org={props.org} firebase={firebase} setWidget={setWidget} />
                :
                <Box>
                    <Stack direction={'row'} sx={{display: { xs: 'block', md: 'none', }}}>
                        {
                        Object.keys(selected)[0] ? 
                        <Box sx={{width: '100%'}}>
                            <User selected={selected} setSelected={setSelected} />
                        </Box>:
                        <Box sx={{width: '100%'}}>
                            <UserSearch button={<RoleButton />} widget={widget} setWidget={setWidget} selected={selected} setSelected={setSelected} org={props.org} firebase={firebase}/>
                        </Box>
                        }
                    </Stack>
                    <Box sx={{display: { xs: 'none', md: 'flex', flexDirection: 'row' }}}>
                        <Box flex={2}>
                            <UserSearch button={<RoleButton />} widget={widget} setWidget={setWidget} selected={selected} setSelected={setSelected} org={props.org} firebase={firebase}/>
                        </Box>
                        <Box flex={1} width={10}>
                            <User selected={selected}/>
                        </Box>
                    </Box>
                </Box>
                
            )}
        </FbContext.Consumer>
    )
}