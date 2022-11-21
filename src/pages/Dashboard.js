import { ThemeProvider } from "@emotion/react"
import { CssBaseline, Drawer, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Stack, Divider } from "@mui/material"
import AuthCheck from "../components/AuthCheck"
import Nav from '../components/Nav'
import { bTheme } from "../Themes"
import { AccountCircle, CalendarToday, DashboardCustomize, EventAvailable, Insights, Mail, Payments, Logout } from '@mui/icons-material'


function MenuItem(props) {
    return (
        <ListItem disablePadding>
            <ListItemButton>
            <ListItemIcon>
                {props.children}
            </ListItemIcon>
            <ListItemText primary={props.text} />
            </ListItemButton>
        </ListItem>
    )
}

function CustomDiv() {
    return (
        <Divider sx={{margin: 1}} color="white" />
    )
}

export default function Dashboard() {
    return (
        <ThemeProvider theme={bTheme}>
            <CssBaseline />
            <AuthCheck>
                <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    paddingTop: 12,
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 270 },
                }}
                open
                >
                    <Stack
                    direction="horizontal"
                    margin={2}
                    spacing={5}
                    >
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                            <img src='favicon.ico' width='32' height='32' />
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'quicksand',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            AgendaRaven
                        </Typography>
                    </Stack>
                    <List>
                        <MenuItem text="My Organizations">
                            <DashboardCustomize color="secondary" />
                        </MenuItem>
                        <MenuItem text="Inbox">
                            <Mail color="secondary" />
                        </MenuItem>
                        <MenuItem text="Posted Schedules">
                            <CalendarToday color="secondary" />
                        </MenuItem>
                        <MenuItem text="My Availability">
                            <EventAvailable color="secondary" />
                        </MenuItem>
                        <CustomDiv/>
                        <MenuItem text="Insights">
                            <Insights color="secondary" />
                        </MenuItem>
                        <CustomDiv/>
                        <MenuItem text="Payments">
                            <Payments color="secondary" />
                        </MenuItem>
                        <CustomDiv/>
                        <MenuItem text="Account">
                            <AccountCircle color="secondary" />
                        </MenuItem>
                        <MenuItem text="Log Out">
                            <Logout color="secondary" />
                        </MenuItem>
                    </List>
                </Drawer>
            </AuthCheck>
        </ThemeProvider>
    )
}