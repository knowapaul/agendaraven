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
import { mTheme } from '../resources/Themes.js'

import { signOut } from 'firebase/auth';

import { AuthContext, UserContext } from '../resources/Auth'

import AuthCheck from './AuthCheck.js';

import { useNavigate } from 'react-router-dom';

import { Navigate } from 'react-router-dom';
import CustomAvatar from './CustomAvatar.js';


const pages = ['Dashboard', 'About Us', 'Help'];


function nameToURL(name) {
    return name.toLowerCase().split(' ').join('')
}

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
                    <MenuItem key={page} onClick={() => {navigate('/' + nameToURL(page))}} >
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
                href="/"
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
            <CustomAvatar />
            </Toolbar>
        </Container>
        </AppBar>
    </ThemeProvider>
    
  );
};
export default ResponsiveAppBar;