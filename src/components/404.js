import { CssBaseline, Paper, ThemeProvider, Typography } from "@mui/material";
import { mTheme, wTheme } from "../resources/Themes";
import Nav from "./Nav";

export default function Error404(props) {
    return (
        <ThemeProvider theme={mTheme}>
            <CssBaseline />
            <Nav />
            <Paper sx={{margin: 2, padding: 2}}>
                <Typography variant='h4'>
                    404 - Not Found
                </Typography>
                <Typography>
                    Sorry, you are not able to view this page. It might be an organization that you do not have permission to access,
                    or it might be an incorrectly typed link.
                </Typography>
            </Paper>
        </ThemeProvider>            
    )
}