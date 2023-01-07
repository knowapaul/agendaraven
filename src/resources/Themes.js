// MUI Resources
import { createTheme } from '@mui/material';

// xs, extra-small: 0px
// sm, small: 600px
// md, medium: 900px
// lg, large: 1200px
// xl, extra-large: 1536px



// TODO: Optimize themeing here to minimize its use throughout the rest of the application

/**
 * Dark Theme
 * 
 * Background
 * - Default: Navy
 * - Paper: Neptune
 * 
 * Primary: Neptune
 * 
 * Secondary: Orange
 * 
 * Text: Transparent white?
 */
export const mTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#001f3d',
    },
    secondary: {
      main: '#e87a00',
    },
    background: {
      default: '#001f3d',
      paper: '#045174',
    },
    text: {
      primary: 'rgba(255,255,255,0.87)',
    },
  },
});

/**
 * Light Theme
 * 
 * Primary: White
 * 
 * Secondary: Orange
 * 
 * Background
 * - Default: Navy
 * - Paper: Neptune
 * 
 * Text
 * - Primary: Neptune
 * - Secondary: Navy
 * 
 * Warning: Gold
 * 
 * Divider: Neptune
 */
export const wTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#e87a00',
    },
    background: {
      paper: '#ffffff',
      default: '#045174',
    },
    text: {
      primary: '#045174',
      secondary: '#001f3d',
    },
    warning: {
      main: 'rgb(178, 149, 0)',
    },
    divider: '#045174',
  },
});

/**
 * Light Theme
 * 
 * Primary: Navy
 * 
 * Secondary: Navy
 * 
 * Background
 * - Default: Orange
 * - Paper: Neptune
 * 
 * Text
 * - Primary: White
 * - Secondary: White
 * 
 * Warning: Gold
 * 
 */
export const oTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#001f3d',
    },
    secondary: {
      main: '#001f3d',
    },
    background: {
      default: '#e87a00',
      paper: '#045174',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
    warning: {
      main: 'rgb(178, 149, 0)',
    },
  },
});

/**
 * Dark Theme
 * 
 * Primary: Navy
 * 
 * Secondary: Orange
 * 
 * Background
 * - Default: Neptune
 * - Paper: Navy
 * 
 * Text
 * - Primary: White
 * 
 * Warning: Gold
 * 
 * Divider: White
 */
export const bTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#001f3d',
    },
    secondary: {
      main: '#e87a00',
    },
    background: {
      default: '#045174',
      paper: '#001f3d',
    },
    text: {
      primary: '#ffffff',
    },
    warning: {
      main: 'rgb(178, 149, 0)',
    },
    divider: '#ffffff',
  },
});

/**
 * Light Theme
 * 
 * Primary: Neptune
 * 
 * Secondary: Navy
 * 
 * Background
 * - Default: White
 * - Paper: Neptune
 * 
 * Text
 * - Primary: Navy
 * - Secondary: White
 * 
 * Divider: White
 */
export const cTheme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        outlined: {
          backgroundColor: '#ffffff',
          borderColor: '#045174',
        },
      },
    },
  },
  palette: {
    type: 'light',
    primary: {
      main: '#045174',
    },
    secondary: {
      main: '#001f3d',
    },
    text: {
      primary: '#001f3d',
      secondary: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#045174',
    },
    divider: '#ffffff',
  },
})