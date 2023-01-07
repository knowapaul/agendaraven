// React Resources
import { useEffect, useState } from "react"

// MUI Resources
import { AddBusiness, ArrowBack, Edit, EventAvailable, Visibility } from '@mui/icons-material'
import { Box, Button, Grid, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";

// Project Resources
import Cards from "../components/Cards";
import AddButton from "../components/AddButton";
import AdminCheck from "../components/AdminCheck";
import { getAllSchedules, saveAvailability } from "../resources/Firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { NavButton, SubNav } from "../components/SubNav";
import { CustomSnackbar } from "../components/CustomSnackbar";


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
    return (
        <Cards 
        data={props.data} 
        open={true}
        setOpen={() => {}}
        helperMessage={'There are currently no schedules to display. If that doesn\'t seem right, try refreshing the page.'} 
        icons={Icons} 
        add={
            <AdminCheck org={props.org} >
                <AddButton 
                open={false}
                text='New Schedule'
                tooltip='Open the Schedule Creator'
                url={'/soar/' + props.org}
                />
            </AdminCheck>
        }
        />
    )
}

function ViewOne(props) {
    const theme = useTheme();


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
                <Typography nowrap variant={'h5'} sx={{lineHeight: '57.5px', mr: 2}} >
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
                {(new Date() < new Date(props.schedule.avDate)) && !props.schedule.contents[0]
                    ?
                    <AvForm avFields={props.schedule.avFields} org={props.org} title={props.schedule.title} />
                    :
                    <Box display={'flex'} flexDirection={'row'} ml='20px' paddingBottom={3}>
                        <Grid container>
                            {props.schedule.fields.map((field, oIndex) => (
                                <Grid item >
                                    <Typography>
                                        {field}
                                    </Typography>
                                    {
                                        props.schedule.contents[0]
                                        ?
                                        props.schedule.contents.map((person, iIndex) => ((

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
                                </Grid>
                            ))
                            }
                        </Grid>
                    </Box>
                }
            </Box>

        </Box>
    )
}

function AvForm(props) {
    const [ data, setData ] = useState({})
    const [ open, setOpen ] = useState(false);
    console.log('field')
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
                            onChange={(e) => {let temp = {...data}; temp[field.title] = e.target.value; console.log(temp, e.target.value, data); setData(temp)}}
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
        <Box overflow={'auto'}>
            {
                schedule ?
                <ViewOne org={props.org} schedule={schedule} handleBack={() => {setSchedule()}} />
                :
                <View org={props.org} firebase={props.firebase} data={data} setSchedule={setSchedule} />
            }
        </Box>
    )
}