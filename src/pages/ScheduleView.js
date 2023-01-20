// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { ArrowBack, Close, ErrorOutline, Info } from '@mui/icons-material';
import { Box, Button, CssBaseline, IconButton, Paper, Popover, Stack, TextField, ThemeProvider, Typography } from "@mui/material";

// Project Resources
import { useTheme } from "@emotion/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { CustomSnackbar } from "../components/CustomSnackbar";
import { NavButton, SubNav } from "../components/SubNav";
import { getAvailability, getFirebase, getPeople, getSchedule, saveAvailability } from "../resources/Firebase";
import { cTheme, wTheme } from "../resources/Themes";


function AvForm(props) {
    const theme = useTheme();
    const [ data, setData ] = useState({})
    const [ open, setOpen ] = useState(false);
    
    useEffect(() => {
        getAvailability(props.org, props.title, setData)
    }, []);

    return (
        <Box>
            <Button 
            sx={{margin: 2, mb: 0}} 
            variant={'contained'}
            onClick={() => {saveAvailability(props.org, props.title, data).then(() => {setOpen(true)})}}
            >
                Save
            </Button>
            <Paper sx={{padding: 2, margin: 2}} variant='outlined'>
                
                <Stack spacing={2}>
                    {props.avFields.map((field) => (
                        <Box key={field.title}>
                            <Typography>
                                {field.title}
                            </Typography>
                            <TextField 
                            value={data[field.title] || ''}
                            onChange={(e) => {let temp = {...data}; temp[field.title] = e.target.value; setData(temp)}}
                            type={field.type}
                            placeholder={field.type.toUpperCase()}
                            />
                        </Box>
                    ))}
                </Stack>
            </Paper>
            <CustomSnackbar 
            severity={'success'}
            text={'Availability Saved'}
            open={open}
            setOpen={setOpen}
            />
        </Box>
    )
}

function InfoButton(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    
    return (
        <div>
            <Box onClick={handleClick} sx={{display: 'flex', flexDirection: 'row'}}>
                <NavButton aria-describedby={id} variant="contained">
                    <Info sx={{mr: {sm: 1}}}/>
                    <Typography sx={{display: {xs: 'none', sm: 'block'}}}>
                        {props.title}
                    </Typography>
                </NavButton>
            </Box>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                >
                <Paper variant={'outlined'} sx={{ p: 2 }}>
                    <Typography sx={{ display: {xs: 'block', sm: 'none'} }} variant='h5'>{props.title}</Typography>
                    <Typography variant='body1'>{props.description}</Typography>
                </Paper>
            </Popover>
        </div>
    );
}

function ScheduleItem(props) {
    const theme = useTheme();
    let displayText = props.row[props.field];
    let highlight;
    try {
        if (props.data.cats[props.field] === 'person') {
            displayText = props.people[props.row[props.field]].schedulename
            // console.log('1, 2', props.people[props.row[props.field]].email, getFirebase().auth.currentUser.email )
            if (props.people[props.row[props.field]].email === getFirebase().auth.currentUser.email) {
                highlight = theme.palette.success.light;
            }
        } else if (props.data.cats[props.field] === 'time') {
            let iDate = new Date();
            let text = props.row[props.field].split(':');
            iDate.setHours(text[0], text[1], 0, 0)
            let out = iDate.toLocaleString('en-US', {timeStyle: 'short'});
            displayText = isNaN(iDate.getTime()) ? props.cats[props.field] : out
        }
    } catch (valueError) {
        console.log("not working: ", valueError)
    }
    if (!displayText) {
        displayText = '---'
    }
    return (
        <Box xs={6} display='flex' flexDirection={'row'} sx={{backgroundColor: highlight}}>
            <Typography sx={{margin: 'auto', padding: '3px', textAlign: 'center'}} variant={"body1"}>
                {displayText}
            </Typography>
        </Box>
    )
}

function Internal() {
    const theme = useTheme();
    
    const [ openBottom, setOpenBottom ] = useState(true);
    const [ people, setPeople ] = useState(true);

    
    const [ data, setData ] = useState();
    const navigate = useNavigate();
    const load = useLoaderData();
    
    const description = (data) => (
        (data.avDate
            ?
            `Availability Due: ${new Date(data.avDate).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})}\n`
            :
            '')
            +
            (data.timestamp
                ?
                `Last Edited: ${new Date(data.timestamp).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})}`
                :
                '')
                )
                
    useEffect(() => {
        getSchedule(load.org, load.sch).then(data => { setData(data) });
        getPeople(load.org, setPeople)
    }, [])

    return (
        data ?
        <Box>
            <SubNav 
            title={load.sch}
            left={
                <NavButton handleClick={() => {navigate(`/${load.org}/schedules/`)}} variant={'contained'} sx={{m: 1}}>
                <ArrowBack sx={{mr: 1}}/>
                <Typography
                sx={{display: {xs: 'none', sm: 'block'}}}
                noWrap
                >
                    Back
                </Typography>
            </NavButton>
            }
            right={
                <InfoButton title={data.type} description={description(data)} />
            }
            />
            <Box height='calc(100vh - 57.5px)' overflow='auto' >
                <Box padding={1} pb={0} sx={{display: {xs: 'none', md: 'block'}}}>
                    <Typography whiteSpace={'break-spaces'} >
                        {description(data)}
                    </Typography>
                </Box>
                
                {
                    (new Date() < new Date(data.avDate)) && !data.contents[0]
                    ?
                    <AvForm avFields={data.avFields} org={load.org} title={load.sch} />
                    :
                    <Box display={'flex'} flexDirection={'row'} ml='20px' margin={0} sx={{ padding: 1}}>
                        <table style={{borderCollapse: 'collapse', }}>
                            <thead>
                                <tr>
                                    {data.fields.map((field, oIndex) => (
                                        <th key={field}>
                                            <Typography sx={{mx: 1, fontWeight: 'bold'}}>
                                                {field}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.contents[0]
                                    ?
                                    data.contents.map((row, iIndex) => ((
                                        <tr key={'row' + iIndex}>
                                            {data.fields.map((field, oIndex) => (
                                                <td key={oIndex + ',' + iIndex} style={{border: `1px solid ${theme.palette.primary.main}`, }}>
                                                    <ScheduleItem field={field} row={row} data={data} people={people} />
                                                </td>
                                            ))
                                        }
                                        </tr>
                                    )))
                                    :
                                    ''
                                }
                            </tbody>
                        </table>
                        {
                            openBottom ?
                            <Paper square sx={{position: 'absolute', bottom: 0, left: 0, display: {xs: 'flex', sm: 'none'}, backgroundColor: wTheme.palette.secondary.main, width: '100%'}}>
                                <ErrorOutline sx={{my: 2, ml: 1}}/>
                                <Typography sx={{m: 2, flex: 1}} variant='body1'>
                                    Try turning your phone on it side for a better view
                                </Typography>
                                <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={() => {setOpenBottom(false)}}
                                sx={{m: 1 }}
                                >
                                    <Close />
                                </IconButton>
                            </Paper>
                            :
                            ''
                        }
                    </Box>
                }
            </Box>

        </Box>
        :
        <Typography>Loading</Typography>
        )
}

export function ScheduleView() {
    return (
        <ThemeProvider theme={cTheme} >
            <CssBaseline />
            <Internal />
        </ThemeProvider>
    )
}