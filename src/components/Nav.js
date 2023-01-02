// React Resources
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI Resources
import { ThemeProvider } from '@emotion/react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

// Project Resources
import { mTheme } from '../resources/Themes.js'
import CustomAvatar from './CustomAvatar.js';


function nameToURL(name) {
    return name.toLowerCase().split(' ').join('')
}

export default function Nav() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };


  const pages = ['Dashboard', 'About Us', 'Help'];
  const title = 'AgendaRaven';

  return (
    <ThemeProvider theme={mTheme}>
        <AppBar position="fixed">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                <img src='/favicon.ico' width='32' height='32' />
            </Box>
            <Typography
                variant="h6"
                noWrap
                component="a"
                href={"/"}
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
                {title}
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
                <img src='/favicon.ico' width='32' height='32' />
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
        <Box sx={{height: 64, display: { xs: 'none', md: 'flex' }}}  />
        <Box sx={{height: 56, display: { xs: 'flex', md: 'none' }}} />
    </ThemeProvider>
    
  );
};