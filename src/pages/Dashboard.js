// React Resources
import * as React from 'react';
import { Link } from 'react-router-dom';

// MUI Resources
import { AccountCircle, CalendarToday, DashboardCustomize, EventAvailable, Insights as InsightsIcon, Mail, Payments as PaymentsIcon, Logout } from '@mui/icons-material'
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import { ThemeProvider } from '@emotion/react';

// Project Resources
import { bTheme } from '../resources/Themes';
import Organizations from '../user-subpages/Organizations';
import Inbox from '../user-subpages/Inbox.js';
import Schedules from '../user-subpages/Schedules.js';
import Availability from '../user-subpages/Availability.js';
import Insights from '../user-subpages/Insights.js';
import Payments from '../user-subpages/Payments.js';
import Account from '../user-subpages/Account.js';
import AuthCheck from '../components/AuthCheck';
import { useLoaderData } from 'react-router-dom';
import DashModel from '../components/DashModel';


const menu = [
  ["My Organizations", <DashboardCustomize color="secondary" />],
  ["Inbox", <Mail color="secondary" />],
  ["Posted Schedules", <CalendarToday color="secondary" />],
  ["My Availability", <EventAvailable color="secondary" />],
  ["", ""],
  ["Insights", <InsightsIcon color="secondary" />],
  ["", ""],
  ["Payments", <PaymentsIcon color="secondary" />],
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
        <img src='../favicon.ico' width='32' height='32' alt='logo'/>
        <Typography
        variant="h6"
        noWrap
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

export async function dashLoader({ params }) {
  const page = params.page ? params.page : 'organizations'
  return page;
}

export function Dashboard(props) {  
  const page = useLoaderData();

  const elementMap = {
    organizations: <Organizations />,
    inbox: <Inbox />,
    schedules: <Schedules />,
    availability: <Availability />,
    insights: <Insights />,
    payments: <Payments />,
    account: <Account />
  };

  return (
    <AuthCheck >
      <ThemeProvider theme={bTheme}>
        <CssBaseline />
          <DashModel 
          menuItems={menu} 
          logo={<Logo />} 
          page={page}
          path={`/dashboard/`} 
          >
            {elementMap[page]}
          </DashModel>
      </ThemeProvider>
    </AuthCheck>
  )
}