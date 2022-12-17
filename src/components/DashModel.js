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
import { bTheme, mTheme } from '../resources/Themes';
import { Router, Routes, Route, useNavigate } from 'react-router-dom';
import Organizations from '../windows/Organizations';
import Availability from '../windows/Availability';
import Schedules from '../windows/Schedules';
import Inbox from '../windows/Inbox';
import Account from '../windows/Account';
import AuthCheck from '../components/AuthCheck';
import CustomAvatar from '../components/CustomAvatar';

const drawerWidth = 250;

export default function DashModel(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };
  
    const drawer = (
      <div>
          <Toolbar 
          disableGutters
          elevation={0}
          >
              <Stack
              direction="row"
              spacing={2} 
              margin={1}
              >
              {props.logo}
              </Stack>
          </Toolbar>
          <Divider />
          {props.menu}
      </div>
    );
  
    const container = window !== undefined ? () => window().document.body : undefined;
  
    return (
      <AuthCheck>
        <Box sx={{ display: 'flex' }}>
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar  sx={{height: '100%', backgroundColor: mTheme.palette.background.paper}}>
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
                variant="h6" 
                noWrap 
                component="div"
                textAlign='center'
                >
                    {props.subPage}
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
            sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >   
            <Box component='main' sx={{height: 64, display: { xs: 'none', sm: 'flex' }}}  />
            <Box component='main' sx={{height: 56, display: { xs: 'flex', sm: 'none' }}} />
            {props.children}
        </Box>
        </Box>
      </AuthCheck>
    );
  }