// React Resources
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI Resources
import { ThemeProvider } from '@emotion/react';
import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, responsiveFontSizes, Toolbar, Typography } from '@mui/material';

// Project Resources
import { mTheme } from '../resources/Themes.js';
import CustomAvatar from './CustomAvatar.js';


function nameToURL(name) {
    return name.toLowerCase().split(' ').join('')
}

export default function Nav() {
  const [ anchorElNav, setAnchorElNav ] = useState(null);
  const [ atTop, setAtTop ] = useState(true);
  const [ verySmall, setVerySmall ] = useState(false);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    window.onscroll = () => {
        if (window.scrollY === 0) {
            setAtTop(true)
        } else {
            if (atTop) {
                setAtTop(false)
            }
        }
    }
    
    function checkVs() {
        if (window.innerWidth < 350) {
            if (!verySmall) {
                setVerySmall(true)
            }
        } else {
            if (verySmall) {
                setVerySmall(false)
            }
        }
    }
    checkVs()
    window.onresize = checkVs
  })


  const pages = ['Dashboard', 'Help'];
  const title = 'AgendaRaven';

  const rTheme = responsiveFontSizes(mTheme)

  return (
    <ThemeProvider theme={mTheme}>
        <AppBar 
        position="fixed" 
        elevation={atTop ? 0 : 10}
        sx={{
            backgroundColor: mTheme.palette.background.default.replace(')', ', .6)').replace('rgb', 'rgba'),
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
        }}>
            <Toolbar disableGutters>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, mr: 1 }}>
                    <img alt='' src='/favicon.ico' width='32' height='32' />
                </Box>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href={"/"}
                    className='quicksand'
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {title}
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, ml: {xs: 0, sm: 1}}}>
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
                <Box sx={{ display: { xs: verySmall ? 'none' : 'flex', md: 'none' }, mr: 1 }} >
                    <img alt='' src='/favicon.ico' width='32' height='32' />
                </Box>
                <ThemeProvider theme={rTheme}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        className='quicksand'
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        AgendaRaven
                    </Typography>
                </ThemeProvider>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                    <Button
                        key={page}
                        href={'/' + nameToURL(page)}
                        onClick={handleCloseNavMenu}
                        className='quicksand'
                        sx={{ color: 'white', display: 'block', }}
                    >
                        {page}
                    </Button>
                    ))}
                </Box>
                <CustomAvatar />
            </Toolbar>
        </AppBar>
        <Box sx={{height: 64, display: { xs: 'none', md: 'flex' }}}  />
        <Box sx={{height: 56, display: { xs: 'flex', md: 'none' }}} />
    </ThemeProvider>
    
  );
};