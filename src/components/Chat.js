import { useTheme } from "@emotion/react";
import { Avatar, Box, Button, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { Send } from "@mui/icons-material";
import Message from './Message'


function Contact(props) {
    return (
        <Tooltip title={props.title}>
            <Avatar sx={{color: props.theme.palette.primary.main}}>
                {props.title[0].toUpperCase()}
            </Avatar>
        </Tooltip>
    )
}


export default function Chat(props) {
    const theme = useTheme();
    console.log(theme, theme.palette)
    console.log(theme.palette.background)
    console.log(theme.palette.background.default)
    return (
        <div>
            <Paper elevation={0} sx={{borderBottom: 'solid', padding: 1, outlineColor: theme.palette.background.default, borderRadius: 0}}>
                <Stack direction="row" spacing={1}>
                    <Contact title="Contact" theme={theme}/>
                    <Contact title="Contact" theme={theme}/>
                    <Contact title="Contact" theme={theme}/>
                    <Contact title="Contact" theme={theme}/>
                </Stack>
            </Paper>
            <Box  elevation={0} sx={{margin: 1 }}>
                <Message side="left"/>
                <Message side="right"/>
                <Message side="left"/>
            </Box>
            <Paper elevation={0} sx={{padding: 1, borderTop: 'solid', outlineColor: theme.palette.background.default, borderRadius: 0, }}>
                <TextField 
                placeholder="Type your message here" 
                sx={{ width: '85%'}}
                variant="outlined"
                multiline
                maxRows={4}
                >
                    
                </TextField>
                <Button disableElevation variant="contained" sx={{pt: 2, pb: 2, width: '10px', outlineColor: theme.palette.primary.main}} >
                    <Send />
                </Button>
            </Paper>
        </div>
    )
}