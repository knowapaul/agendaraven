// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { ArrowBack, Close, ErrorOutline, Info, Save } from '@mui/icons-material';
import { Box, Button, Chip, CssBaseline, IconButton, Paper, Popover, Stack, TextField, ThemeProvider, Typography, useMediaQuery } from "@mui/material";

// Project Resources
import { useTheme } from "@emotion/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { CustomSnackbar } from "../components/CustomSnackbar";
import { NavButton, SubNav } from "../components/SubNav";
import { getAvailability, getFirebase, getPeople, getSchedule, saveAvailability } from "../resources/Firebase";
import { cTheme, wTheme } from "../resources/Themes";
import OrgCheck from '../components/OrgCheck'
import AuthCheck from "../components/AuthCheck";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { onAuthStateChanged } from "firebase/auth";


function AvForm(props) {
    const theme = useTheme();
    const [ data, setData ] = useState({})
    const [ saved, setSaved ] = useState(true);
    
    useEffect(() => {
        getAvailability(props.org, props.title, setData)
    }, []);

    function save() {
        saveAvailability(props.org, props.title, data)
            .then(() => {
                setSaved(true)
            })
    }


    return (
        <Box>
            <div style={{display: 'flex', flexDirection: 'row', padding: 8}}>
                <Box 
                sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                }}
                flex={1}
                >
                    <Chip
                    sx={{ml: 2}}
                    label={saved ? 'Saved' : 'Not Saved'}
                    color={saved ? 'success' : 'error'}
                    onClick={save}
                    />
                </Box>
                <Box >
                    <Button 
                    variant={'contained'}
                    onClick={save}
                    sx={{mr: 2}}
                    >
                        <Save sx={{mr: 1}}/>
                        Save
                    </Button>
                </Box>
                
            </div>
            <Paper sx={{padding: 2, margin: 2, mt: 0}} variant='outlined'>
                <Stack spacing={2}>
                    {props.avFields.map((field) => (
                        <Box key={field.title}>
                            <Typography>
                                {field.title}
                            </Typography>
                            <TextField 
                            value={data[field.title] || ''}
                            sx={{minWidth: '120px'}}
                            onChange={(e) => {let temp = {...data}; temp[field.title] = e.target.value; setData(temp); setSaved(false)}}
                            type={field.type}
                            placeholder={field.type.toUpperCase()}
                            />
                        </Box>
                    ))}
                </Stack>
            </Paper>
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
            if (props.people[props.row[props.field]].uid === getFirebase().auth.currentUser.uid) {
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
        // console.log("not working: ", valueError)
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
    const [ error, setError ] = useState('Loading...');

    
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
        getSchedule(load.org, load.sch).then(data => { setData(data) }).catch((error) => {setError(error.message)});
        getPeople(load.org, setPeople)
    }, [])

    return (
        
                    
                    data ?
                    <Box>
                        <div className="printHidden" >
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
                        </div>
                        <ErrorBoundary>
                            <Box padding={1} pb={0} sx={{width: '100%', display: {xs: 'none', md: 'block'}}}>
                                <Typography whiteSpace={'break-spaces'} >
                                    {description(data)}
                                </Typography>
                            </Box>
                            
                            {
                                (new Date() < new Date(data.avDate)) && !data.contents[0]
                                ?
                                <AvForm avFields={data.avFields} org={load.org} title={load.sch} />
                                :
                                <div>
                                    <div className="printHidden">
                                        {
                                            openBottom ?
                                            <Paper square  sx={{ display: {xs: 'flex', sm: 'none'}, backgroundColor: wTheme.palette.secondary.main, width: '100%'}}>
                                                <ErrorOutline sx={{my: 2, ml: 1}}/>
                                                <Typography sx={{my: 2, ml: 1, flex: 1}} variant='body1'>
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
                                    </div>
                                    <table style={{borderCollapse: 'collapse', margin: 8}}>
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
                                    
                                </div>
                            }
                        </ErrorBoundary>
            
                    </Box>
                    :
                    <Typography>{error}</Typography>
                    
    )
}

export function ScheduleView() {
    const load = useLoaderData();

    return (
        <ThemeProvider theme={cTheme} >
            <CssBaseline />
            <AuthCheck>
                <OrgCheck org={load.org}>
                    <ErrorBoundary>
                        <Internal />
                    </ErrorBoundary>
                </OrgCheck>
            </AuthCheck>
        </ThemeProvider>
    )
}