import { AccountCircle, CalendarToday, DashboardCustomize, EventAvailable, Insights, Mail, Payments, Logout } from '@mui/icons-material'
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import { ThemeProvider } from '@emotion/react';
import { bTheme } from '../resources/Themes';
import { Router, Routes, Route, useNavigate } from 'react-router-dom';
import Organizations from '../windows/Organizations';
import Availability from '../windows/Availability';
import Schedules from '../windows/Schedules';
import Inbox from '../windows/Inbox';
import Account from '../windows/Account';
import AuthCheck from '../components/AuthCheck';
import CustomAvatar from '../components/CustomAvatar';

const drawerWidth = 250;

function MenuItem(props) {
    const navigate = useNavigate();



    const handleClick = (text, setSubPage) => {
        console.log(text)
        if (text === 'Log Out') {
            navigate('/logout')
        } else {
            setSubPage(text)
            navigate('/dashboard/' + text.split(' ').slice(-1)[0].toLowerCase())
        }
    }

    return (
        <ListItem 
        disablePadding
        onClick={() => {handleClick(props.text, props.setSubPage)}}
        >
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

function Menu(props) {
    return (
        <List>
            <MenuItem setSubPage={props.setSubPage} text="My Organizations">
                <DashboardCustomize color="secondary" />
            </MenuItem>
            <MenuItem setSubPage={props.setSubPage} text="Inbox">
                <Mail color="secondary" />
            </MenuItem>
            <MenuItem setSubPage={props.setSubPage} text="Posted Schedules">
                <CalendarToday color="secondary" />
            </MenuItem>
            <MenuItem setSubPage={props.setSubPage} text="My Availability">
                <EventAvailable color="secondary" />
            </MenuItem>
            <CustomDiv/>
            <MenuItem setSubPage={props.setSubPage} text="Insights">
                <Insights color="secondary" />
            </MenuItem>
            <CustomDiv/>
            <MenuItem setSubPage={props.setSubPage} text="Payments">
                <Payments color="secondary" />
            </MenuItem>
            <CustomDiv/>
            <MenuItem setSubPage={props.setSubPage} text="Account">
                <AccountCircle color="secondary" />
            </MenuItem>
            <MenuItem setSubPage={props.setSubPage} text="Log Out">
                <Logout color="secondary" />
            </MenuItem>
        </List>
    )
}

function Dashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [subPage, setSubPage] = React.useState('My Organizations')

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
        <Toolbar 
        disableGutters
        >
            <Stack
            direction="row"
            spacing={2} 
            margin={1}
            >
            <img src='../favicon.ico' width='32' height='32' />
            <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
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
        </Toolbar>
        <Divider />
        <Menu setSubPage={setSubPage} />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <AuthCheck>
        <ThemeProvider theme={bTheme} >
            <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1, display:'flex', justifyContent: 'center'}}>
                    <Typography 
                    variant="h6" 
                    noWrap 
                    component="div"
                    textAlign='center'
                    >
                        {subPage}
                    </Typography>
                </Box>
                <CustomAvatar />
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                onClick={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                >
                {drawer}
                </Drawer>
                <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
                >
                {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {props.children}
            </Box>
            </Box>
        </ThemeProvider>
    </AuthCheck>
  );
}


export default Dashboard;