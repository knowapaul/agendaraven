// React Resources
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// MUI Resources
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { useTheme } from '@emotion/react';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Stack, ThemeProvider, Paper } from '@mui/material';

// Project Resources
import AuthCheck from '../components/AuthCheck';
import CustomAvatar from '../components/CustomAvatar';
import { ErrorBoundary } from './ErrorBoundary';
import { uTheme } from '../resources/Themes';
import zIndex from '@mui/material/styles/zIndex';


const drawerWidth = 250;

function lowLast(text) {
    return text.split(' ').slice(-1)[0].toLowerCase()
}

function Logo(props) {
    const theme = useTheme();
  
    return (
      <Link to={props.href} style={{textDecoration: 'none', color: theme.palette.primary.main}}>
        <Stack
        direction="row"
        spacing={2} 
        margin={1}
        >
          {props.icon}
          <Typography
          variant="h6"
          noWrap
          sx={{
          fontFamily: 'quicksand',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: theme.palette.text.secondary
          }}
          >
            {props.title}
          </Typography>
        </Stack>
      </Link>
    )
  }

function MenuItem(props) {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleClick = (text) => {
        if (text === 'Log Out') {
            navigate('/logout')
        } else {
            // Just use the last word of the button's string
            navigate(props.path + lowLast(text))
        }
    }

    const isSelected = lowLast(props.page) === lowLast(props.text)

    return (
        <ListItem 
        disablePadding
        onClick={() => {handleClick(props.text)}}
        sx={{
            backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.background.default
        }}
        >
            <ListItemButton>
                <ListItemIcon color="secondary">
                    {props.icon}
                </ListItemIcon>
            <ListItemText primary={props.text} sx={{ color: isSelected ? theme.palette.background.default : theme.palette.primary.main}} />
            </ListItemButton>
        </ListItem>
    )
}

function Menu(props) {
    const theme = useTheme()
    return (
        <List>
            {props.items.map((item, n) => {
                const text = item[0]; 
                const Icon = item[1];
                return (
                    Icon ? 
                    <MenuItem key={n} path={props.path} setSelected={props.setSelected} page={props.page} text={text} icon={Icon} menuColor={props.menuColor} />
                    :
                    <Divider key={n} sx={{borderColor: theme.palette.primary.main, margin: 1}} />
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
 * - props.page: the path of the currently selected menu item
 * - props.logo: {title, icon, href}
 * - props.path: the root path of the page
 */
export default function DashModel(props) {
    const { win } = props;
    const [ mobileOpen, setMobileOpen ] = useState(false);
    const [ atTop, setAtTop ] = useState(true);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    // const contrastTheme = createTheme({
    //     components: {
    //         MuiPaper: {
    //           styleOverrides: {
    //             outlined: {
    //               backgroundColor: theme.palette.background.paper,
    //               color: theme.palette.text.primary,
    //             },
    //           },
    //         },
    //         MuiInputBase: {
    //             styleOverrides: {
    //                 root: {
    //                     color: theme.palette.text.primary
    //                 }
    //             }
    //         }
    //       },
    //     palette: {
    //         type: theme.palette.type,
    //         primary: {
    //           main: theme.palette.background.default,
    //         },
    //         secondary: {
    //           main: theme.palette.secondary.main,
    //         },
    //         background: {
    //           paper: theme.palette.background.default,
    //         },
    //         text: {
    //           primary: theme.palette.background.paper,
    //           secondary: theme.palette.background.default,
    //         },
    //         warning: {
    //           main: 'rgb(178, 149, 0)',
    //         },
    //         divider: theme.palette.background.default,
    //       },
    // })
  
    const drawer = (
        <div>
          <Toolbar
            disableGutters  
            sx={{boxShadow: 'none'}}      
          >
              <Logo {...props.logo} />
          </Toolbar>
          <Divider sx={{borderColor: uTheme.palette.primary.main}} />
          <Menu path={props.path} page={props.page} items={props.menuItems}/>
      </div>
    );
  
    const container = win !== undefined ? () => win().document.body : undefined;

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
      })    
  
    return (
        <ThemeProvider theme={uTheme}>
            <AuthCheck>
                <Box sx={{ display: 'flex', flexDirection: 'row', height: {xs: '100%', sm: '100vh'}, width: '100vw', position: { xs: 'static' } , top: 0, left: 0}}>
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
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: uTheme.palette.background.default },
                        }}
                        >
                        {drawer}
                        </Drawer>
                        <Box
                        sx={{
                            position: 'fixed',
                            width: drawerWidth,
                            display: { xs: 'none', sm: 'block' },
                            borderRight: `1px solid ${uTheme.palette.primary.main}`,
                            height: '100vh',
                        }}
                        >
                        {drawer}
                        </Box>
                    </Box>
                    <Box flex={1} >
                        <Paper 
                        square
                        elevation={atTop ? 0 : 10}
                        sx={{
                            position: 'fixed', top: 0, right: 0,
                            width: {xs: '100vw', sm: `calc(100vw - ${drawerWidth}px)`},
                            backgroundColor: uTheme.palette.background.default.replace(')', ', .6)').replace('rgb', 'rgba'),
                            flex: '0 1 auto',
                            zIndex: 1200,
                            boxShadow: 'none',
                            ml: '1px',
                            WebkitBackdropFilter: 'blur(10px)',
                            backdropFilter: 'blur(10px)',
                        }}
                        >
                            <Toolbar  sx={{height: '100%' }} >
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon color="primary" />
                            </IconButton>
                            <Box sx={{ flexGrow: 1, display:'flex', justifyContent: 'center' }}>
                                <Typography 
                                variant="h5" 
                                noWrap 
                                component="div"
                                textAlign='center'
                                sx={{color: uTheme.palette.text.secondary}}
                                >
                                    {props.page[0].toUpperCase() + props.page.slice(1)}
                                </Typography>
                            </Box>
                            <CustomAvatar />
                            </Toolbar>
                            <Divider sx={{borderColor: uTheme.palette.primary.main}} />
                        </Paper>
                        <ErrorBoundary>
                            <Box sx={{height: {xs: '59px', sm: '65px'}}} />
                            <Box
                            sx={{ 
                                flexGrow: 1, 
                                width: '100%', 
                                height: {xs: 'calc(100% - 59px)', sm: 'calc(100% - 65px)'}
                            }}>
                                    {props.children}
                            </Box>
                        </ErrorBoundary>
                    </Box>
                </Box>
            </AuthCheck>
        </ThemeProvider>
    );
}