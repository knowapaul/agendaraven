import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography, Box } from '@mui/material'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/system';
import { mTheme } from '../resources/Themes'
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirebase } from '../resources/Firebase';


function nameToURL(name) {
    return name.toLowerCase().split(' ').join('')
}

export default function CustomAvatar(props) {
    const [user, loading] = useAuthState(getFirebase().auth)

    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();

    const settings = ['Dashboard', 'Logout'];


    const handleOpenUserMenu = (event, user) => {
        if (!user) {
            if (!document.URL.endsWith('dashboard')) {
                navigate('/dashboard')
            }
        } else {
            setAnchorElUser(event.currentTarget);
        }
      };

      const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      };

    return (
        <ThemeProvider theme={mTheme}>
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title={user ? "Menu" : "Login"}>
                    <IconButton onClick={(event) => handleOpenUserMenu(event, user)} sx={{ p: 0 }}>
                    {
                    user ? 
                        <Avatar>{user.email[0].toUpperCase()}</Avatar>
                        : <Avatar />
                        }
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
                {settings.map((item) => (
                    <MenuItem key={item} onClick={() => {navigate('/' + nameToURL(item))}}>
                    <Typography textAlign="center">{item}</Typography>
                    </MenuItem>
                ))}
                </Menu>
            </Box>
        </ThemeProvider>
        
    )
}