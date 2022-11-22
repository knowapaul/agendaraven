import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography, Box } from '@mui/material'
import { useState } from 'react';
import { AuthContext, UserContext } from '../resources/Auth'
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/system';
import { mTheme } from '../pages/Themes'


function nameToURL(name) {
    return name.toLowerCase().split(' ').join('')
}

export default function CustomAvatar(props) {
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
        <ThemeProvider theme={mTheme}>
            <Box sx={{ flexGrow: 0 }}>
                    <AuthContext.Consumer>
                        {auth => (
                            <UserContext.Consumer>
                                {user => {

                                    console.log(user)
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
    }}
                            </UserContext.Consumer>
                        )}
                    </AuthContext.Consumer>
            </Box>
        </ThemeProvider>
    )
}