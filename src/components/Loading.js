// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { CircularProgress, Box, CssBaseline, Typography, Stack } from "@mui/material";

// Project Resources
import { mTheme } from "../resources/Themes";


export function MiniLoad(props) {
    return (
        <Box
            display='flex'
            justifyContent={'center'}
            alignContent={'center'}
            
            >
            <Stack >
                <Typography
                textAlign={'center'}
                mt={5}
                mb={3}
                >
                    {
                    props.text 
                    ? 
                    props.text
                    :
                    'Loading...'
                    }
                </Typography>
                <Box
                display='flex'
                justifyContent={'center'}
                alignContent={'center'}
                
                >
                    <CircularProgress color="secondary" />
                </Box>
            </Stack>
        </Box>
)
}

export default function Loading(props) {
    return (
        <ThemeProvider theme={mTheme}>
            <CssBaseline />
            <MiniLoad text={props.text} />
        </ThemeProvider>
    )
}