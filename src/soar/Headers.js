
// React Resources
import { useState } from "react";

// MUI Resources
import { useTheme } from "@emotion/react";
import { ArrowBack, AutoAwesome, Public, Save, ViewAgenda } from "@mui/icons-material";
import { Backdrop, Box, Chip, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from "@mui/material";

// Project Resources
import { MenuIcon } from './MenuIcon';

// Other Resources

// MUI Resources
import { CalendarMonth, EventAvailable, Group, ImportantDevices } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


// Other Resources

function nameToURL(name) {
    return name.toLowerCase().split(' ').join('')
}


export function Bottom(props) {
    const theme = useTheme();

    const [ open, setOpen ] = useState(false);

    const options = {
        "Schedule": <CalendarMonth />,
        "Forms": <EventAvailable />,
        "Import": <ImportantDevices />,
        "Availability":  <Group />,
        "Automation":  <AutoAwesome />,
    }
    
    return (
        <Box>
            <Backdrop open={open} sx={{display: {xs: 'initial', md: 'none'}}}/>
            <SpeedDial
                ariaLabel="Tab Selection"
                direction="up"
                icon={<SpeedDialIcon />}
                sx={{ position: 'fixed', bottom: 16, right: 16}}
                onClose={() => {setOpen(false)}}
                onOpen={() => {setOpen(true)}}
                open={open}
                >
                    {Object.keys(options).map(opt => (
                        <SpeedDialAction
                        key={opt}
                        tooltipTitle={opt}
                        tooltipOpen
                        onClick={() => {props.setTab(nameToURL(opt)); setOpen(false)}} 
                        selected={props.tab === nameToURL(opt)}
                        icon={options[opt]}
                        />
                    ))}
                </SpeedDial>
        </Box>
    )
}

/**
 * @param  {Map} props
 * 
 * props.db
 */
export function Top(props) {
    const navigate = useNavigate();
    return (
        <Box>
            <Paper 
            square
            elevation={0}
            sx={{
                margin: 0,
                width: '100%', 
                height: 64,
                display: "flex",
                flexDirection: 'row',
            }}
            >
                <Box 
                flex={1} 
                height='100%' 
                sx={{display: 'flex',
                    alignItems: 'center'}}
                >
                    <Box paddingLeft={2}>
                    <Typography variant={'h5'}>
                        {props.title}
                    </Typography>
                    <Typography variant="subtitle2">
                        {props.type}
                    </Typography>
                    </Box>
                </Box>
                <Box 
                flex={0} 
                display='flex' 
                flexDirection={'row'}
                >
                    <Chip label={props.isSaved ? "Saved" : "Not Saved"} sx={{margin: 'auto'}} color={props.isSaved ? 'success' : 'error'} />
                    <MenuIcon title="Back"
                    handleClick={() => {navigate(`/${props.org}/schedules/`)}}
                    >
                        <ArrowBack />
                    </MenuIcon>
                    <MenuIcon title="Save"
                    handleClick={() => {props.save(false)}}
                    >
                        <Save />
                    </MenuIcon>
                    <MenuIcon title="Publish"
                    handleClick={() => {props.save(true)}}
                    >
                        <Public />
                    </MenuIcon>
                    
                </Box>
            </Paper>
        </Box>
    )
}

{/* <MenuIcon title="Undo">
        <Undo />
    </MenuIcon>
    <MenuIcon title="Redo">
        <Redo />
    </MenuIcon> 
    <MenuIcon title="Download">
        <Download/> 
    </MenuIcon>
                */}