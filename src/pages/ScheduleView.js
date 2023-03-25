// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { ArrowBack, Close, ErrorOutline, Info, Save, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Chip, CssBaseline, IconButton, Paper, Popover, responsiveFontSizes, Skeleton, Stack, Tab, Tabs, TextField, ThemeProvider, Typography } from "@mui/material";

// Project Resources
import { useLoaderData, useNavigate } from "react-router-dom";
import AdminCheck from "../components/AdminCheck";
import AuthCheck from "../components/AuthCheck";
import { ErrorBoundary } from "../components/ErrorBoundary";
import OrgCheck from '../components/OrgCheck';
import { NavButton, SubNav } from "../components/SubNav";
import Schedules from "../org-subpages/Schedules";
import { getAvailability, getFirebase, getPeople, getSchedule, saveAvailability } from "../resources/Firebase";
import { cTheme, uTheme, wTheme } from "../resources/Themes";


function ScheduleItem(props) {
    let displayText = props.row[props.field];
    let highlight;
    try {
        if (props.data.cats[props.field] === 'person') {
            displayText = props.people[props.row[props.field]].schedulename
            if (props.people[props.row[props.field]].uid === getFirebase().auth.currentUser.uid) {
                highlight = uTheme.palette.success.light;
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
    // if (!displayText) {
    //     displayText = '---'
    // }
    return (
        <Box xs={6} display='flex' flexDirection={'row'} sx={{backgroundColor: highlight}}>
            <Typography sx={{margin: 'auto', padding: '3px', textAlign: 'center'}} variant={"body1"}>
                {displayText}
            </Typography>
        </Box>
    )
}

const description = (data) => (
    (data.avDate
        ?
        `Availability Due: ${new Date(data.avDate).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})}\n`
        :
        ''
    )
        +
    (
    data.timestamp
    ?
    `Last Edited: ${new Date(data.timestamp).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})}`
    :
    '')
)

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
        props.description ?
        <div>
            <Box onClick={handleClick} sx={{display: 'flex', flexDirection: 'row'}}>
                <NavButton aria-describedby={id} variant="contained">
                    <Info sx={{mr: 1}}/>
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
        :
        ''
    );
}

function Header(props) {
    const navigate = useNavigate();
    
    return (
        <div className="printHidden" >
        <SubNav 
        
        title={props.sch}
        left={
            <NavButton handleClick={() => {navigate(`/${props.org}/schedules/`)}} variant={'contained'} sx={{m: 1}}>
            <ArrowBack sx={{mr: 1}}/>
            <Typography
            sx={{display: {xs: 'none', sm: 'block'}}}
            noWrap
            >
                Schedules
            </Typography>
        </NavButton>
        }
        right={
            <InfoButton title={props.data.type} description={description(props.data)} />
        }
        />
    </div>
    )
}

function AvForm(props) {
    const [ data, setData ] = useState({})
    const [ saved, setSaved ] = useState(true);
    
    useEffect(() => {
        getAvailability(props.org, props.title, setData)
    }, [props.org, props.title]);

    function save() {
        saveAvailability(props.org, props.title, data)
            .then(() => {
                setSaved(true)
            })
    }

    const rTheme = responsiveFontSizes(uTheme)

    console.log('avfields', props.avFields, )
    return (
        
        <Box mt={2}>
            <div style={{display: props.avFields.length > 0 ? 'flex' : 'none', flexDirection: 'row', padding: 8}}>
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
            <Paper sx={{padding: 2, margin: 2, mt: 0, backgroundColor: props.overdue ? uTheme.palette.grey[300] : 'none'}} variant='outlined' >
                {
                    props.avFields.length > 0
                    ?
                    <div>
                        <ThemeProvider theme={rTheme}>
                            <Box display={props.overdue ? 'block' : 'none' } sx={{backgroundColor: uTheme.palette.error.light, margin: -2, padding: 1, mb: 2}}>
                                <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                                    <Box
                                    display='flex'
                                    justifyContent={'center'}
                                    alignContent={'center'}
                                    >
                                        <Box>
                                            <Typography variant='h5' width={'100%'}  sx={{verticalAlign: 'center'}}>
                                                This form is overdue and is no longer editable
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                    display='flex'
                                    justifyContent={'center'}
                                    alignContent={'center'}
                                    >
                                        <Box>
                                            <Typography variant='subtitle2' width={'100%'} sx={{verticalAlign: 'center'}}>
                                                If this doesn't seem right, contact your administrator
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{display: {xs: 'block', sm: 'none'}}}>
                                    <Typography variant='subtitle2' width={'100%'}  sx={{verticalAlign: 'center'}}>
                                        <strong>This form is overdue and is no longer editable.</strong> If this doesn't seem right, contact your administrator.
                                    </Typography>
                                </Box>
                            </Box>
                        </ThemeProvider>
                        <Stack spacing={2}>
                            {props.avFields.map((field) => (
                                <Box key={field.title}>
                                    <Typography>
                                        {field.title}
                                    </Typography>
                                    <TextField 
                                    disabled={props.overdue}
                                    value={data[field.title] || ''}
                                    sx={{minWidth: '120px'}}
                                    onChange={(e) => {let temp = {...data}; temp[field.title] = e.target.value; setData(temp); setSaved(false)}}
                                    type={field.type}
                                    placeholder={field.type.toUpperCase()}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </div>
                    :
                    <Typography>No availability form has been posted for this schedule.</Typography>
                }
            </Paper>
        </Box>
    )
}

function DisplaySchedule(props) {
    const [ openBottom, setOpenBottom ] = useState(true);

    return (
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
            {
                props.loading
                ?
                <Skeleton variant="rectangular" height="300px" width='100%' />
                :
                <table style={{borderCollapse: 'collapse', margin: 8, marginTop: 16}}>
                    <thead>
                        <tr>
                            {props.data.fields.map((field, oIndex) => (
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
                            props.data.contents[0]
                            ?
                            props.data.contents.map((row, iIndex) => ((
                                <tr key={'row' + iIndex}>
                                    {props.data.fields.map((field, oIndex) => (
                                        <td key={oIndex + ',' + iIndex} style={{border: `1px solid ${uTheme.palette.primary.main}`, }}>
                                            <ScheduleItem field={field} row={row} data={props.data} people={props.people} />
                                        </td>
                                    ))
                                }
                                </tr>
                            )))
                            :
                            undefined
                        }
                    </tbody>
                </table>
            }
        </div>
    )
}

function Internal() {
    
    const [ people, setPeople ] = useState(true);
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(true)
    const [ view, setView ] = useState('schedule');

    
    const [ data, setData ] = useState();
    const load = useLoaderData();

    const [ overdue, setOverdue ] = useState(false)
                
    useEffect(() => {
        getSchedule(load.org, load.sch).then(data => { setData(data); console.log('data', data); return data })
            .then((nData) => {
                setLoading(false); 
                const tOverdue = new Date() > new Date(nData?.avDate) 
                console.log('overdue', tOverdue, nData?.avDate)
                setView(nData?.avFields?.length > 0  && !tOverdue && !nData.contents[0] ? 'availability' : 'schedule');
                setOverdue(tOverdue);
            }).catch((error) => {setError(error.message)});
        getPeople(load.org, setPeople)
    }, [load.org, load.sch])

    const handleChange = (event, newValue) => {
        setView(newValue);
      };
    
    const t = "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"
    const tProps = {
        WebkitTransition: t,
        transition: t,
        flex: 1, 
        "&:hover": { backgroundColor: uTheme.palette.grey[300] }, 
        borderBottom: `2px solid ${uTheme.palette.grey[300]}`
    }
      
    return (
        <div>
            <Header sch={load.sch} data={data ? data : {}} org={load.org} />
            {
                error ?
                <Typography>{error}</Typography>
                :
                data && !loading ?
                <Box>
                    <ErrorBoundary>
                        <ThemeProvider theme={uTheme}>
                            <Box >
                                <Tabs variant="fullWidth" value={view} onChange={handleChange} aria-label="View Selector" sx={{ display: 'flex', }}>
                                    <Tab sx={tProps} label="Availability" value='availability' aria-controls='Select-Availability' />
                                    <Tab sx={tProps}label="Schedule" value='schedule' aria-controls='Select-Schedule' />
                                </Tabs>
                            </Box>
                        </ThemeProvider>
                        <Box padding={2} pb={0} sx={{width: '100%', display: {xs: 'none', md: 'block'}}}>
                            <Typography whiteSpace={'break-spaces'} >
                                {description(data)}
                            </Typography>
                        </Box>
                        {
                            view === 'availability'
                            ?
                            <AvForm avFields={data.avFields} org={load.org} title={load.sch} overdue={overdue} />
                            :
                            data.fields?.length
                            ?
                            <DisplaySchedule data={data} people={people} loading={loading} />
                            :
                            <Typography sx={{padding: 2}}>
                                We couldn't find a schedule to display yet. If that doesn't seem right, try contacting your organization's administrator.
                            </Typography>
                        }
                    </ErrorBoundary>
                </Box>
                :
                // Falback for schedule found:
                <div>
                    <ThemeProvider theme={uTheme}>
                        <Paper square sx={{ padding: 2, mt: '1px'}}>
                            <Typography 
                            variant='subtitle1'
                            >
                                <strong>
                                    Sorry, we couldn't find a schedule with that name.
                                </strong>
                                <AdminCheck org={load.org} helperText={'The schedules below are all of the currently posted schedules in your organization.'}>
                                    Below are all of your organization's schedules. 
                                    Remember to click the "Publish" button
                                    on your schedules before attempting to view them here.

                                    Any schedule with a <VisibilityOff fontSize="small" sx={{pt: '3px'}}/> icon before its name 
                                    is hidden to everyone except administrators using the 
                                    schedule editor.
                                </AdminCheck>
                            </Typography>
                        </Paper>
                        <Schedules org={load.org} noHeader={true}/>
                    </ThemeProvider>
                </div>
            }
        </div>
    )
}

export function ScheduleView() {
    const load = useLoaderData();

    return (
        <ThemeProvider theme={cTheme} >
            <CssBaseline />
            <AuthCheck>
                <OrgCheck org={load.org}>
                    {(loading) => (
                        <ErrorBoundary>
                            <Internal />
                        </ErrorBoundary>
                    )}
                </OrgCheck>
            </AuthCheck>
        </ThemeProvider>
    )
}