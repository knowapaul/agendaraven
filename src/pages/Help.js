// MUI Resources
import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Paper, Typography } from '@mui/material';

// Project Resources
import Nav from '../components/Nav.js';
import { mTheme } from '../resources/Themes.js';


export default function Help(props) {
    return (
        <ThemeProvider theme={mTheme}>
            <CssBaseline />
            <Nav />
            <Paper sx={{margin: 2, padding: 2}}>
                <Typography variant={'h5'}>
                    How to create an account:
                </Typography>
                <ol>
                    <li>
                        Click on the user icon in the top right corner of the page.
                    </li>
                    <li>
                        Click "Create Account" below the login button.
                    </li>
                    <li>
                        Input your information:
                        <ul>
                            <li>
                                Your email can only be used for one account.
                            </li>
                            <li>
                                Your email will be automatically shared with all the other members of your organizations. This is required in 
                                order to differentiate between users with similar names.
                            </li>
                            <li>
                                The "Schedule Name" field is for your preferred name. If your preferred name is your first name, leave this field blank.
                            </li>
                            <li>
                                Your phone number can be shared with your organization's administrators, but it is not public.
                            </li>
                            <li>
                                Your password must be longer than 8 characters.
                            </li>
                            <li>
                                As of now, it is impossible to change any of your login credentials, so make sure that they are correct. You can recover
                                your password if you inputed a correct email upon account creation.
                            </li>
                        </ul>
                    </li>
                </ol>
            </Paper>
            <Paper sx={{margin: 2, padding: 2}}>
                <Typography variant={'h5'}>
                    How to join an organization:
                </Typography>
                <ol>
                    <li>
                        Click "dashboard" and login if you have not already done so.
                    </li>
                    <li>
                        Click "Create or Join" button on the organization homepage.
                    </li>
                    <li>
                        Ask your organization owner for a join code and an organization name. Put these 
                        into the provided fields
                        <ul>
                            <li>
                                Organization names do not have spaces. If there is a space in the organization name, use an underscore symbol "_".
                            </li>
                            <li>
                                The join code can only consist of seven letters and numbers. Do not include the dash or any spaces.
                            </li>
                        </ul>
                    </li>
                </ol>
            </Paper>
            <Paper sx={{margin: 2, padding: 2}}>
                <Typography variant={'h5'}>
                    How to resolve an error message.
                </Typography>
                Since this is a new site, there will inevitably be a lot of errors. I appreciate your patience in dealing with them.

                If refreshing the page does not resolve the error, try clearing your browser's cache.
                <ul>
                    <li>
                        On a laptop or PC this can be done by holding shift and clicking the refresh button simultaneously. 
                    </li>
                    <li>
                        On a phone, this can be done by going to settings and clearing your browsers cache for this website.
                    </li>
                </ul>

                If that does not resolve the error, you can send a screenshot of what's going on and a 
                description to agendaraven@gmail.com. I can do my best to resolve the problem from there.

                For the most part, it will just take time to resolve issues. My apologies in advance!
            </Paper>
        </ThemeProvider>
    )
}