// MUI Resources
import { Box, Button, Tooltip, Typography } from "@mui/material";


/*
This is the most important component of all of AgendaRaven.
It's where all the magic happens. As a result, much of the 
time working on the program should be spent here. This is 
the main selling point of the program, and its success and 
user-friendliness is vital to the success of the program.
*/
export function MenuIcon(props) {
    return (
        <Tooltip title={props.title}>
            <Button 
            variant={props.selected ? "text" : "contained" }
            disableElevation
            onClick={props.handleClick}
            sx={{
                textTransform: 'none', 
                borderRadius: 0, 
                height: '100%',
                width: props.width
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