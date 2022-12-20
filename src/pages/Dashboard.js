import { AccountCircle, CalendarToday, DashboardCustomize, EventAvailable, Insights, Mail, Payments, Logout } from '@mui/icons-material'
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import { ThemeProvider } from '@emotion/react';
import { bTheme } from '../resources/Themes';
import { Link } from 'react-router-dom';
import Organizations from '../windows/Organizations';
import AuthCheck from '../components/AuthCheck';
import { useLoaderData } from 'react-router-dom';
import { FbContext } from '../resources/Firebase';
import DashModel from '../components/DashModel';

const drawerWidth = 250;

export async function dashLoader({ params }) {
  const page = params.page ? params.page : 'organizations'
  return page;
}

const menu = [
  ["My Organizations", <DashboardCustomize color="secondary" />],
  ["Inbox", <Mail color="secondary" />],
  ["Posted Schedules", <CalendarToday color="secondary" />],
  ["My Availability", <EventAvailable color="secondary" />],
  ["", ""],
  ["Insights", <Insights color="secondary" />],
  ["", ""],
  ["Payments", <Payments color="secondary" />],
  ["", ""],
  ["Account", <AccountCircle color="secondary" />],
  ["Log Out", <Logout color="secondary" />]
]

function Logo() {
  return (
    <Link to="/" style={{textDecoration: 'none'}}>
      <Stack
      direction="row"
      spacing={2} 
      margin={1}
      >
        <img src='../favicon.ico' width='32' height='32' />
        <Typography
        variant="h6"
        noWrap
        component="a"
        sx={{
        fontFamily: 'quicksand',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'white',
        }}
        >
          AgendaRaven
        </Typography>
      </Stack>
    </Link>
  )
}

export function Dashboard(props) {  
  const page = useLoaderData();

  const elementMap = {
    organizations: <Organizations />
  };

  return (
    <AuthCheck >
      <ThemeProvider theme={bTheme}>
        <CssBaseline />
        <FbContext.Consumer >
            {firebase => {
              // const storage = firebase.storage;
              // accessImage(storage, 'image.jpg', setSource)
              return (
                <DashModel 
                menuItems={menu} 
                logo={<Logo />} 
                menuColor="secondary" 
                title={page ? page : 'Organizations'} 
                path={`/dashboard/`} 
                >
                  {elementMap[page]}
                </DashModel>
              )
            }}
        </FbContext.Consumer>
      </ThemeProvider>
    </AuthCheck>
  )
}