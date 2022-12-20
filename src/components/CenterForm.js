import { ThemeContext, ThemeProvider } from "@emotion/react";
import { Paper } from "@mui/material";
import { mTheme } from "../resources/Themes";
import {CssBaseline} from "@mui/material";

export default function CenterForm(props) {
    return (
        <ThemeProvider theme={mTheme}>
            <CssBaseline />
            <Paper
            variant="outlined"
            sx={{
                maxWidth: 400,
                mx: 'auto', // margin left & right
                my: 4, // margin top & bottom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
            }}
            >
                {props.children}
            </Paper>
        </ThemeProvider>
    )
}