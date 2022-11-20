import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { ThemeProvider } from '@emotion/react';
import { mTheme } from '../Themes.js'

import { signOut } from 'firebase/auth';

import { AuthContext, UserContext } from '../Auth'

import AuthCheck from './AuthCheck.js';

import { useNavigate } from 'react-router-dom';

import { Navigate } from 'react-router-dom';


const pages = ['Dashboard', 'About Us', 'Help'];
const settings = {
    'Account' : (event) => {},
    'Dashboard' : (event) => {},
    'Logout' : (event, auth) => {signOut(auth); window.location.href = './'},
};


function nameToURL(name) {
    return name.toLowerCase().split(' ').join('')
}

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event, user) => {
    console.log(event, user)
    if (!user) {
        if (!document.URL.endsWith('dashboard')) {
            navigate('/dashboard')
        }
    } else {
        setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={mTheme}>
        <AppBar position="fixed">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
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

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                >
                <MenuIcon />
                </IconButton>
                <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                    display: { xs: 'block', md: 'none' },
                }}
                >
                {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                ))}
                </Menu>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} >
                <img src='favicon.ico' width='32' height='32' />
            </Box>
            <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'Quicksand',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                AgendaRaven
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                <Button
                    key={page}
                    href={'/' + nameToURL(page)}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'Quicksand'}}
                >
                    {page}
                </Button>
                ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
                <AuthContext.Consumer>
                    {auth => (
                        <UserContext.Consumer>
                            {user => (
                                <div>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={(event) => handleOpenUserMenu(event, user)} sx={{ p: 0 }}>
                                            <Avatar 
                                            alt={user ? user.displayName : '?'} 
                                            src={user ? user.photoURL : ''} 
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    >
                                    {Object.entries(settings).map((item) => (
                                        <MenuItem key={item[0]} onClick={(event) => {item[1](event, auth)}}>
                                        <Typography textAlign="center">{item[0]}</Typography>
                                        </MenuItem>
                                    ))}
                                    </Menu>
                                </div>
                            )}
                        </UserContext.Consumer>
                    )}
                </AuthContext.Consumer>
            </Box>
            </Toolbar>
        </Container>
        </AppBar>
    </ThemeProvider>
    
  );
};
export default ResponsiveAppBar;