// React Resources
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI Resources
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { ThemeProvider, useTheme } from '@emotion/react';
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, createTheme } from '@mui/material';

// Project Resources
import AuthCheck from '../components/AuthCheck';
import CustomAvatar from '../components/CustomAvatar';




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

    console.log('st', props.page, props.text)

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
    console.log('default', props.page)
  
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
  
    console.log('ct', contrastTheme)

    const drawer = (
      <div>
          <Toolbar 
          disableGutters
          elevation={0}
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
        <Box sx={{ padding: 10, display: 'flex',  minWidth: '300px', overflow: 'auto'}}>
            
            <AppBar
            position="fixed"
            elevation={0}
            sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            }}
            >
                <Toolbar  sx={{height: '100%'}}>
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
                '& .MuiDrawer-paper': { boxSizing: 'border-box', borderColor: theme.palette.background.default, width: drawerWidth },
            }}
            open
            >
            {drawer}
            </Drawer>
        </Box>
        <ThemeProvider theme={contrastTheme}>
            <Box
                component="main"
                sx={{ flexGrow: 1, position: 'fixed', top: '0px', right: '0px', width: {xs: '100%', sm: `calc(100% - ${drawerWidth}px)` } }}
            >   
                <Box component='main' sx={{height: 64, display: { xs: 'none', sm: 'flex' }}}  />
                <Box component='main' sx={{height: 56, display: { xs: 'flex', sm: 'none' }}} />
                <Box sx={{backgroundColor: theme.palette.background.paper, height: 'calc(100vh - 64px)'}}>
                    {props.children}
                </Box>
            </Box>
        </ThemeProvider>
        </Box>
      </AuthCheck>
    );
  }