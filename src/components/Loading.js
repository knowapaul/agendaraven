import { ThemeProvider } from "@emotion/react";
import { CircularProgress, CssBaseline, Typography, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { mTheme } from "../resources/Themes";


export default function Loading() {
    return (
        <ThemeProvider theme={mTheme}>
            <CssBaseline />
            <MiniLoad />
        </ThemeProvider>
    )
}

export function MiniLoad() {
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
                    Loading...
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