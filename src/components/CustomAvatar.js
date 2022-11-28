import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography, Box } from '@mui/material'
import { useState } from 'react';
import { AuthContext, UserContext } from '../resources/Auth'
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/system';
import { mTheme } from '../resources/Themes'
import { FbContext } from '../resources/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';


function nameToURL(name) {
    return name.toLowerCase().split(' ').join('')
}

export default function CustomAvatar(props) {
    


    return (
        <ThemeProvider theme={mTheme}>
            <Box sx={{ flexGrow: 0 }}>
                <FbContext.Consumer>
                    {firebase => (
                        <InternalAvatar firebase={firebase}/>
                    )}
                </FbContext.Consumer>
            </Box>
        </ThemeProvider>
    )
}

function InternalAvatar(props) {
    const auth = props.firebase.auth;
    const [user, loading] = useAuthState(auth)

    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();

    const settings = ['Account', 'Dashboard', 'Logout'];


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

      const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      };

    return (
        <div>
            <Tooltip title={user ? "Open settings" : "Login"}>
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
        </div>
    )
}