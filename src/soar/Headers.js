
// React Resources
import { useState } from "react";

// MUI Resources
import { useTheme } from "@emotion/react";
import { Download, Redo, Save, Undo } from "@mui/icons-material";
import { Box, Chip, Paper, TextField, Typography } from "@mui/material";

// Project Resources
import { MenuIcon } from './MenuIcon'
import { saveSchedule } from "../resources/Firebase";

// Other Resources


export function Bottom(props) {
    const theme = useTheme();
    return (
        <Box 
        display={'flex'}
        flexDirection='row'
        sx={{ height: '54px' }}
        >
            <Box 
            flex={0}
            display={'flex'}
            flexDirection={'row'}
            >
                {props.children}
            </Box>
            <Box
            sx={{
                backgroundColor: theme.palette.primary.main, 
                flexGrow: 1
            }}
            elevation={0}
            >
                <Box sx={{float: 'right'}}>
                    {props.right}
                </Box>
            </Box>
        </Box>
    )
}
/**
 * @param  {Map} props
 * 
 * props.db
 */
export function Top(props) {
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
                    <Chip label="Not Saved" sx={{margin: 'auto'}} color={'error'} />
                    <MenuIcon title="Undo">
                        <Undo />
                    </MenuIcon>
                    <MenuIcon title="Redo">
                        <Redo />
                    </MenuIcon>
                    <MenuIcon title="Save"
                    handleClick={props.save}
                    >
                        <Save />
                    </MenuIcon>
                    <MenuIcon title="Download">
                        <Download/> 
                    </MenuIcon>
                </Box>
            </Paper>
        </Box>
    )
}