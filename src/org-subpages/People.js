// React Resources
import { useEffect, useState } from "react"
import { useDocument } from 'react-firebase-hooks/firestore';

// MUI Resources
import { Stack, Paper, Box, Typography, Avatar, Button } from "@mui/material"
import { ArrowBack, Visibility } from "@mui/icons-material";

// Project Resources
import { getFirebase, getRolesDoc } from "../resources/Firebase";
import Form from "../components/Form";
import UserSearch from "../components/UserSearch";
import Cards from "../components/Cards";

// Firebase Resources
import { httpsCallable } from "firebase/functions";
import AddButton from "../components/AddButton";
import AdminCheck from "../components/AdminCheck";
import { ErrorBoundary } from "../components/ErrorBoundary";


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
                        <Typography m={1} display={'none'}>
                            {data.email ? "Email: " + data.email : ''}
                        </Typography>
                        <Button variant="contained" color="secondary" sx={{display: 'none'}}>
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
    const [ loading, setLoading ] = useState(true)
    const [ roles, setRoles ] = useState();
    const [ formData, setFormData ] = useState({});
    const [ formOpen, setFormOpen ] = useState(false);
    const addRole = httpsCallable(getFirebase().functions, 'addRole');

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
                ).then(() => {
                    getRolesDoc(props.org, setRoles, setLoading, true)
                    setFormOpen(false)
                })
            }}
            >
                <Typography>
                    {`Key: ${key.slice(0, 3)} - ${key.slice(3)}`}
                </Typography>
            </Form>
        )
    }
    
    useEffect(() => {
        getRolesDoc(props.org, setRoles, setLoading)
    }, [])

    return (
        <Cards
        data={roles ? Object.keys(roles).map((k) => (
                {
                    title: roles[k].roleName,
                    subtitle: `Key: ${roles[k].roleKey.slice(0, 3)} - ${roles[k].roleKey.slice(3)}`,
                    description: roles[k].roleDescription
                }
            ))
            :
            {}
        }
        helperMessage={"You currently have no roles in your organization. Click 'Add Role' to begin."}
        loading={loading}
        back={{
            handleBack: () => {props.setWidget('users')},
            tooltip: 'Back to People',
        }}
        add={
            <AdminCheck org={props.org}  >
                <AddButton 
                form={<NewForm />}
                formTitle={"Add Role"}
                open={formOpen}
                setOpen={setFormOpen}
                tooltip={"Create a Role"}
                text={"New Role"}
                />
            </AdminCheck>
        }
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
        <ErrorBoundary>
            {
                widget === 'roles' ? 
                    <Roles org={props.org} setWidget={setWidget} />
                :
                <Box>
                    <Stack direction={'row'} sx={{display: { xs: 'block', md: 'none', }}}>
                        {
                        Object.keys(selected)[0] ? 
                        <Box sx={{width: '100%'}}>
                            <User selected={selected} setSelected={setSelected} />
                        </Box>:
                        <Box sx={{width: '100%'}}>
                            <UserSearch button={<RoleButton />} widget={widget} setWidget={setWidget} selected={selected} setSelected={setSelected} org={props.org} />
                        </Box>
                        }
                    </Stack>
                    <Box sx={{display: { xs: 'none', md: 'flex', flexDirection: 'row' }}}>
                        <Box flex={2}>
                            <UserSearch button={<RoleButton />} widget={widget} setWidget={setWidget} selected={selected} setSelected={setSelected} org={props.org} />
                        </Box>
                        <Box flex={1} width={10}>
                            <User selected={selected}/>
                        </Box>
                    </Box>
                </Box>
            }
        </ErrorBoundary>
    )
}