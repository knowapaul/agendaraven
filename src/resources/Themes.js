import { createTheme } from '@mui/material';

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

export const cTheme = createTheme({
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