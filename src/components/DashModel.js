// React Resources
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI Resources
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { ThemeProvider, useTheme } from '@emotion/react';
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, createTheme, Paper } from '@mui/material';

// Project Resources
import AuthCheck from '../components/AuthCheck';
import CustomAvatar from '../components/CustomAvatar';
import { ErrorBoundary } from './ErrorBoundary';


const drawerWidth = 250;

function lowLast(text) {
    return text.split(' ').slice(-1)[0].toLowerCase()
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
            backgroundColor: isSelected ? theme.palette.background.default : theme.palette.primary.main
        }}
        >
            <ListItemButton>
                <ListItemIcon color="secondary">
                    {props.icon}
                </ListItemIcon>
            <ListItemText primary={props.text} sx={{ color: isSelected ? theme.palette.primary.main : theme.palette.background.default}} />
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
                    <MenuItem key={n} path={props.path} setSelected={props.setSelected} page={props.page} text={text} icon={Icon} menuColor={props.menuColor} />
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
 * - props.page: the path of the currently selected menu item
 * - props.logo: the upper-left hand corner logo
 * - props.path: the root path of the page
 */
export default function DashModel(props) {
    const { win } = props;
    const [ mobileOpen, setMobileOpen ] = useState(false);
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
  
    const drawer = (
        <div>
          <Toolbar
            disableGutters        
          >
              {props.logo}
          </Toolbar>
          <Divider sx={{borderColor: theme.palette.background.default}}/>
          <Menu path={props.path} page={props.page} items={props.menuItems}/>
      </div>
    );
  
    const container = win !== undefined ? () => win().document.body : undefined;
  
    return (
      <AuthCheck>
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0}}>
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
                <Paper
                square
                sx={{
                    width: drawerWidth,
                    display: { xs: 'none', sm: 'block' },
                    borderRight: `1px solid ${theme.palette.background.default}`,
                    height: '100vh'
                }}
                >
                {drawer}
                </Paper>
            </Box>
            <Box flex={1}>
                <Paper
                square
                elevation={0}
                sx={{
                    width: '100%',
                    flex: '0 1 auto'
                }}
                >
                    <Toolbar  sx={{height: '100%'}} >
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
                            {props.page[0].toUpperCase() + props.page.slice(1)}
                        </Typography>
                    </Box>
                    <CustomAvatar />
                    </Toolbar>
                    <Divider sx={{borderColor: theme.palette.background.default}}/>
                </Paper>
                <ThemeProvider theme={contrastTheme}>
                    <ErrorBoundary>
                        <Box
                        sx={{ 
                            flexGrow: 1, 
                            width: '100%', 
                            backgroundColor: theme.palette.background.paper, 
                            height: '100%',
                        }}>
                                {props.children}
                        </Box>
                    </ErrorBoundary>
                </ThemeProvider>
            </Box>
        </Box>
      </AuthCheck>
    );
}