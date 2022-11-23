import { ThemeProvider } from "@emotion/react";
import { Typography, Paper, Button, CssBaseline} from "@mui/material";
import { Link } from "react-router-dom";
import Nav from '../components/Nav';
import { mTheme } from "../resources/Themes";


function Paragraph(props) {
    return (
        <Typography variant="body" margin={1} display="block">
            {props.children}
        </Typography>
    )
}

export default function Error(props) {
    console.log('error', props)
    return (
        <div>
            <Nav />
            <ThemeProvider theme={mTheme}>
                <CssBaseline />
                <Paper sx={{padding: 3, mt: 10}}>
                    <Typography variant="h6">
                        Sorry, an error has occured
                    </Typography>
                    
                    <Paragraph>
                        Your experience on this site matters deeply to us,
                        and we would like to do everything we can to get you
                        back on the site as soon as possible. 
                    </Paragraph>
                    <Paragraph>
                        In order to resolve the issue, you can contact us _here_
                        for us to help you, or you can visit our <Link to="/help">help page</Link> for more information.
                    </Paragraph>
                    <Paragraph>
                        One way that you can help us to improve our services
                        is by letting our team to inspect the data that was 
                        loading on the page when it crashed. If you click the
                        button below, you release our team to inspect what went
                        wrong. We will never share your data, and you can read
                        about what we do to ensure its safety in our _privacy
                        policy_.
                    </Paragraph>
                     
                    <Button variant="contained">
                        Release analytics data
                    </Button>
                </Paper>
            </ThemeProvider>
        </div>
    )
}