
// React Resources
import { useState } from "react";

// MUI Resources
import { useTheme } from "@emotion/react";
import { ArrowBack, AutoAwesome, Public, Save, ViewAgenda } from "@mui/icons-material";
import { Backdrop, Box, Button, Chip, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip, Typography } from "@mui/material";

// Project Resources
import { MenuIcon } from './MenuIcon';

// Other Resources

// MUI Resources
import { CalendarMonth, EventAvailable, Group, ImportantDevices } from "@mui/icons-material";


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

function TopButton(props) {
    return (
        <Tooltip title={props.title}>
            <Button 
            variant={props.selected ? "text" : "contained" }
            onClick={props.handleClick}
            sx={{
                textTransform: 'none', 
                margin: 2
            }}
            >
                <Box minWidth='64px'>
                    {props.children}
                    <Typography sx={{fontSize: '12px'}} margin={0}>
                        {props.title}
                    </Typography>
                </Box>
            </Button>
        </Tooltip>
    )
}

/**
 * @param  {Map} props
 * 
 * props.db
 */
export function Top(props) {
    return (
        <Box 
        flex={0} 
        display='flex' 
        flexDirection={'row'}
        sx={{height: '64px', width: '100%'}}
        >
            <Button
            onClick={() => {props.save(false)}}
            sx={{textTransform: 'none', margin: 1}}
            variant='contained'
            >
                <Save sx={{mr: 1}}/>
                <Typography>Save</Typography>
            </Button>
            <Button
            onClick={() => {props.save(false)}}
            sx={{textTransform: 'none', margin: 1}}
            variant='contained'
            >
                <Public sx={{mr: 1}}/>
                <Typography>Publish</Typography>
            </Button>
            <Chip label={props.isSaved ? "Saved" : "Not Saved"} sx={{my: 'auto', float: 'right'}} color={props.isSaved ? 'success' : 'error'} />

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