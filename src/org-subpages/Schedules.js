// React Resources
import { useEffect, useState } from "react"

// MUI Resources
import { AddBusiness, ArrowBack, Edit, EventAvailable, Visibility } from '@mui/icons-material'
import { Box, Button, Grid, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";

// Project Resources
import Cards from "../components/Cards";
import AddButton from "../components/AddButton";
import AdminCheck from "../components/AdminCheck";
import { getAllSchedules, getSchedule, saveAvailability, saveSchedule } from "../resources/Firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { NavButton, SubNav } from "../components/SubNav";
import { CustomSnackbar } from "../components/CustomSnackbar";
import Form from "../components/Form"
import { ErrorBoundary } from "../components/ErrorBoundary";


{/* <Tooltip title={"My Availability"}>
    <IconButton color="secondary">
        <EventAvailable />
    </IconButton>
</Tooltip> */}

// Options for the View component
function Icons(props) {
    const navigate = useNavigate();
    return (
        <Box display={'flex'} flexDirection={'row'}>
            <Tooltip title={"View Schedule"}>
                <IconButton color="secondary"
                    onClick={() => {props.setSchedule(props)}}>
                
                    <Visibility />
                </IconButton>
            </Tooltip>
            
            <AdminCheck org={props.org}>
                <Tooltip title={"Edit Schedule"}>
                    <IconButton color="secondary" onClick={() => {
                        navigate(`/soar/${props.org}/${props.title}`)
                    }}>
                        <Edit />
                    </IconButton>
                </Tooltip>
            </AdminCheck>
        </Box>
    )
}

// View posted schedules
function View(props) {
    const [ data, setData ] = useState({});
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState();
    const navigate = useNavigate();

    function handleSubmit() {
        saveSchedule(props.org, data.schedulename, {
            title: data.schedulename, 
            type: data.scheduletype,
            contents: [],
            fields: [],
            timestamp: new Date().toString()
        })
            .then(() => {
                navigate(`/soar/${props.org}/${data.schedulename}`)
            })
            .catch((e) => {
                setError(e.message)
            })
    }

    return (
        <Cards 
        data={props.data} 
        open={true}
        setOpen={() => {}}
        helperMessage={"There are currently no schedules to display. If that doesn't seem right, try refreshing the page."} 
        icons={Icons} 
        add={
            <AdminCheck org={props.org} >
                <AddButton 
                open={open}
                setOpen={setOpen}
                text='New Schedule'
                tooltip='Create a schedule'
                formTitle='Create a schedule'
                form={
                    <Form
                    inputs={[
                        {title: 'Schedule Name', placeholder: 'Case sensitive', type: 'text', required: true, validate: 'title'},
                        {title: 'Schedule Type', placeholder: 'Describe your schedule', type: 'text', required: true, validate: 'exists'},
                    ]}
                    data={data}
                    setData={setData}
                    buttonText={'Go to SOAR'}
                    handleSubmit={handleSubmit}
                    formError=''
                    />
                }
                formError={error}
                />
            </AdminCheck>
        }
        />
    )
}

function ViewOne(props) {
    const theme = useTheme();
    const [ data, setData ] = useState();

    useEffect(() => {
        getSchedule(props.org, props.schedule.title).then(data => { setData(data) })
    })

    return (
        <Box>
            <SubNav 
            title={props.schedule.title}
            left={
            <NavButton handleClick={props.handleBack} variant={'contained'} sx={{m: 1}}>
                <ArrowBack sx={{mr: 1}}/>
                <Typography
                noWrap
                >
                    Back
                </Typography>
            </NavButton>
            }
            right={
                <Typography noWrap variant={'h5'} sx={{lineHeight: '57.5px', mr: 2}} >
                    {props.schedule.subtitle}
                </Typography>
            }
            />
            <Box height='calc(100vh - 64px - 57.5px)' overflow='auto' >
                <Box sx={{padding: 2, pt: 0}}>
                    <Typography whiteSpace={'break-spaces'}>
                        {props.schedule.description}
                    </Typography>
                    
                </Box>
                
                {data ?
                (new Date() < new Date(data.avDate)) && !data.contents[0]
                    ?
                    <AvForm avFields={data.avFields} org={props.org} title={props.schedule.title} />
                    :
                    <Box display={'flex'} flexDirection={'row'} ml='20px' paddingBottom={3}>
                            {data.fields.map((field, oIndex) => (
                                <Box key={'o' + oIndex}>
                                    <Typography>
                                        {field}
                                    </Typography>
                                    {
                                        data.contents[0]
                                        ?
                                        data.contents.map((person, iIndex) => ((

                                            <Box xs={6} display='flex' flexDirection={'row'} key={oIndex + ',' + iIndex} sx={{border: `1px solid ${theme.palette.primary.main}`}}>
                                                <Typography sx={{margin: 'auto', padding: 2, textAlign: 'center'}}>
                                                    {person[field]
                                                    ? 
                                                    person[field]
                                                    :
                                                    '---'
                                                    }
                                                </Typography>
                                            </Box>
                                        )))
                                        :
                                        ''
                                    }
                                </Box>
                            ))
                            }
                    </Box>
                :
                ''
                }
            </Box>

        </Box>
    )
}

function AvForm(props) {
    const [ data, setData ] = useState({})
    const [ open, setOpen ] = useState(false);
    return (
        <Box>
            <Button 
            sx={{margin: 2, mb: 0}} 
            variant={'contained'}
            onClick={() => {saveAvailability(props.org, props.title, data).then(() => {setOpen(true)})}}
            >
                Save
            </Button>
            <Paper sx={{padding: 2, margin: 2}}>
                
                <Stack spacing={2}>
                    {props.avFields.map((field) => (
                        <Box>
                            <Typography>
                                {field.title}
                            </Typography>
                            <TextField 
                            value={data[field.title]}
                            onChange={(e) => {let temp = {...data}; temp[field.title] = e.target.value; setData(temp)}}
                            type={field.type}
                            placeholder={field.type.toUpperCase()}
                            />
                        </Box>
                    ))}
                </Stack>
            </Paper>
            <CustomSnackbar 
            text={'Availability Saved'}
            open={open}
            setOpen={setOpen}
            />
        </Box>
    )
}


// Main export
export default function Schedules(props) {
    const [ data, setData ] = useState([]);
    const [ schedule, setSchedule ] = useState();

    useEffect(() => {
        getAllSchedules(props.org, setData, setSchedule)
    }, [])

    return (
        <ErrorBoundary>
            <Box overflow={'auto'}>
                {
                    schedule ?
                        <ViewOne org={props.org} schedule={schedule} handleBack={() => {setSchedule()}} />
                    :
                    <View org={props.org} title={props.title} firebase={props.firebase} data={data} setSchedule={setSchedule} />
                }
            </Box>
        </ErrorBoundary>
    )
}