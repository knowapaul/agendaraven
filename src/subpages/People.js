import { Stack, Paper, Box, Typography, TextField, Avatar, Grid, Button, CircularProgress, Divider } from "@mui/material"
import { useTheme } from "@emotion/react"
import { useState } from "react"
import { ArrowBack, Visibility } from "@mui/icons-material";
import { FbContext } from '../resources/Firebase'
import { getPeople, getPeopleDoc, getRolesDoc } from "../resources/HandleDb";
import PopupForm from "../components/PopupForm";
import AddIcon from '@mui/icons-material/Add'
import Form from "../components/Form";
import { httpsCallable } from "firebase/functions";
import { useDocument } from 'react-firebase-hooks/firestore';
import UserSearch from "../components/UserSearch";
import Cards from "../components/Cards";


function User(props) {
    let full, nameText, first, last, data;
    if (Object.keys(props.selected)[0]) {
        full = Object.keys(props.selected)[0]
        nameText = full.split(' ');
        first = nameText[0][0].toUpperCase() + nameText[0].slice(1);
        last = nameText[1][0].toUpperCase() + nameText[1].slice(1);
        data = props.selected[full];
    }

    const theme = useTheme();

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

function Add(props) {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState({});

    const key = getCode();

    // TODO: Extract this component

    return (
        <Box >
            <Button  
            variant="contained" 
            aria-label="add" 
            onClick={() => {setOpen(true)}}
            >
                <AddIcon sx={{mr: 1}} />
                <Typography
                noWrap
                >

                    Add Role
                </Typography>
            </Button>

            <PopupForm open={open} setOpen={setOpen} title={"Add Role"} width={300}>
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
                data={data} 
                setData={setData} 
                buttonText={'Add'} 
                handleSubmit={() => {
                    props.addRole(
                        {
                        orgName: props.org,
                        roleName: data.rolename, 
                        roleKey: key, 
                        roleDescription: data.roledescription
                        }
                    ).then(
                        setOpen(false)
                    )
                }}
                >
                    <Typography>
                        {`Key: ${key.slice(0, 3)} - ${key.slice(3)}`}
                    </Typography>
                </Form>
            </PopupForm>
        </Box>
    )
}


// TODO: use the Cards component for this functionality
function Roles(props) {
    const db = props.firebase.db;
    const functions = props.firebase.functions;

    const [ rolesDoc, loading, error ]= useDocument(getRolesDoc(db, props.org));
    const addRole = httpsCallable(functions, 'addRole');
    const data = rolesDoc ? rolesDoc.data() : false;
    
    return (
        <div>
            <Box 
            sx={{display: 'flex', padding: 1}}
            >
                <Box flex={1}>
                    <Button 
                    onClick={() => {props.setWidget('users')}}
                    variant='contained'
                    >
                        <ArrowBack sx={{mr: 1}}/>
                        <Typography
                        noWrap
                        >
                            Back
                        </Typography>
                    </Button>
                </Box>
                <Box flex={0}>
                    <Add addRole={addRole} org={props.org} />
                </Box>
            </Box>
            {loading ? <CircularProgress />
            :
            <Grid container 
            height={'calc(100vh - 64px - 52.5px)'} 
            overflow='scroll' 
            padding={1} 
            spacing={2} 
            sx={{mt: 0}}
            >
                {data ?
                Object.keys(data).map((key) => (
                    <Grid item 
                    xs={12} sm={12} md={6} lg={4} xl={3} 
                    width={'100%'} 
                    sx={{aspectRatio: '16 / 9'}}
                    key={key}
                    >
                        <Paper 
                        variant="outlined"
                        sx={{
                            py: 1,
                            px: 2,
                            aspectRatio: '16 / 9',
                        }}
                        >
                            <Typography
                            variant='h6'
                            fontWeight={'bold'}
                            >
                                {data[key].roleName}
                            </Typography>
                            <Divider />
                            <Typography
                            variant='body2'
                            >
                                {`Join Code: ${key.slice(0, 3)} - ${key.slice(3)}`}
                            </Typography>
                            <Typography
                            variant='body1'
                            mt={1}
                            >
                                {data[key].roleDescription}
                            </Typography>
                        </Paper>
                    </Grid>
                ))
                :
                <Typography padding={4} textAlign={'center'}>
                    You currently have no roles in your organization. Click 'Add Role' to begin.
                </Typography>
            }
                
            </Grid>
            }
        </div>
    )
}

function NewRoles(props) {
    const db = props.firebase.db;
    const functions = props.firebase.functions;

    const [ rolesDoc, loading, error ]= useDocument(getRolesDoc(db, props.org));
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
                <NewRoles org={props.org} firebase={firebase} setWidget={setWidget} />
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