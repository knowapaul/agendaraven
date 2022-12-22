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
import { ThemeProvider, useTheme } from '@emotion/react';
import { bTheme, mTheme } from '../resources/Themes';
import { Router, Routes, Route, useNavigate } from 'react-router-dom';
import Organizations from '../windows/Organizations';
import Availability from '../windows/Availability';
import Schedules from '../windows/Schedules';
import Inbox from '../windows/Inbox';
import Account from '../windows/Account';
import AuthCheck from '../components/AuthCheck';
import CustomAvatar from '../components/CustomAvatar';
import { createTheme } from '@mui/material';

const drawerWidth = 250;



function MenuItem(props) {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleClick = (text) => {
        if (text === 'Log Out') {
            navigate('/logout')
        } else {
            // Just use the last word of the button's string
            navigate(props.path + text.split(' ').slice(-1)[0].toLowerCase())
        }
    }

    return (
        <ListItem 
        disablePadding
        onClick={() => {handleClick(props.text)}}
        >
            <ListItemButton>
                <ListItemIcon color={props.menuColor}>
                    {props.icon}
                </ListItemIcon>
            <ListItemText primary={props.text} />
            </ListItemButton>
        </ListItem>
    )
}

function Menu(props) {
    return (
        <List>
            {props.items.map((item, n) => {
                const text = item[0]; 
                const Icon = item[1];
                return (
                    Icon ? 
                    <MenuItem key={n} path={props.path} text={text} icon={Icon} menuColor={props.menuColor} />
                    :
                    <Divider key={n} sx={{margin: 1}} />
                )
            })}
        </List>
    )
}

/**
 * A universal shell for dashboard formats
 * 
 * @param  {Map} props
 * *React props:*
 * - props.menuItems: map of menu items in the format *name : icon*
 * - props.menuColor: the icon color of menu items (if different from default)
 * - props.logo: the upper-left hand corner logo
 * - props.path: the root path of the page
 * - props.title: the page's title
 */
export default function DashModel(props) {
    const { win } = props;
    const [ mobileOpen, setMobileOpen ] = React.useState(false);
    const theme = useTheme();
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const contrastTheme = createTheme({
        components: {
            MuiPaper: {
              styleOverrides: {
                outlined: {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                },
              },
            },
          },
        palette: {
            type: theme.palette.type,
            primary: {
              main: theme.palette.background.default,
            },
            secondary: {
              main: theme.palette.secondary.main,
            },
            background: {
              paper: theme.palette.background.default,
            },
            text: {
              primary: theme.palette.background.paper,
              secondary: theme.palette.background.default,
            },
            warning: {
              main: 'rgb(178, 149, 0)',
            },
            divider: theme.palette.background.default,
          },
    })
  
    console.log('ct', contrastTheme)

    const drawer = (
      <div>
          <Toolbar 
          disableGutters
          elevation={0}
          >
              {props.logo}
          </Toolbar>
          <Divider sx={{borderColor: theme.palette.background.default}}/>
          <Menu path={props.path} items={props.menuItems} menuColor={props.menuColor}/>
      </div>
    );

    const [windowSize, setWindowSize] = React.useState({
        width: undefined,
        height: undefined,
      });
    React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
        // Set window width/height to state
        setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        });
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
    }})
    
  
    const container = win !== undefined ? () => win().document.body : undefined;
  
    return (
      <AuthCheck>
        <Box sx={{ display: 'flex'}}>
            
            <AppBar
            position="fixed"
            elevation={0}
            sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            }}
            >
                <Toolbar  sx={{height: '100%'}}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1, display:'flex', justifyContent: 'center', 
    }}>
                    <Typography 
                    variant="h5" 
                    noWrap 
                    component="div"
                    textAlign='center'
                    color={contrastTheme.palette.text.secondary}
                    >
                        {props.title[0].toUpperCase() + props.title.slice(1)}
                    </Typography>
                </Box>
                <CustomAvatar />
                </Toolbar>
                <Divider sx={{borderColor: theme.palette.background.default}}/>
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
                '& .MuiDrawer-paper': { boxSizing: 'border-box', borderColor: theme.palette.background.default, width: drawerWidth },
            }}
            open
            >
            {drawer}
            </Drawer>
        </Box>
        <ThemeProvider theme={contrastTheme}>
            <Box
                component="main"
                sx={{ flexGrow: 1, position: 'fixed', top: '0px', right: '0px', width: {xs: '100%', sm: `calc(100% - ${drawerWidth}px)` } }}
            >   
                <Box component='main' sx={{height: 64, display: { xs: 'none', sm: 'flex' }}}  />
                <Box component='main' sx={{height: 56, display: { xs: 'flex', sm: 'none' }}} />
                <Box sx={{backgroundColor: theme.palette.background.paper, height: 'calc(100vh - 64px)'}}>
                    {props.children}
                </Box>
            </Box>
        </ThemeProvider>
        </Box>
      </AuthCheck>
    );
  }