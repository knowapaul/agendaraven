// React Resources
import * as React from 'react';
import { Link } from 'react-router-dom';

// MUI Resources
import { ThemeProvider, useTheme } from '@emotion/react';
import { AccountCircle, DashboardCustomize, Logout } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Project Resources
import { useLoaderData } from 'react-router-dom';
import AuthCheck from '../components/AuthCheck';
import DashModel from '../components/DashModel';
import { uTheme, wTheme } from '../resources/Themes';
import Account from '../user-subpages/Account.js';
import Availability from '../user-subpages/Availability.js';
import Inbox from '../user-subpages/Inbox.js';
import Insights from '../user-subpages/Insights.js';
import Organizations from '../user-subpages/Organizations';
import Payments from '../user-subpages/Payments.js';
import Schedules from '../user-subpages/Schedules.js';


// ["Inbox", <Mail color="secondary" />],
// ["Posted Schedules", <CalendarToday color="secondary" />],
// ["My Availability", <EventAvailable color="secondary" />],
// ["", ""],
// ["Insights", <InsightsIcon color="secondary" />],
// ["", ""],
// ["Payments", <PaymentsIcon color="secondary" />],

// ["Account", <AccountCircle color="secondary" />],

//   ["Account", <AccountCircle color="secondary" />],



const menu = [
  ["My Organizations", <DashboardCustomize color="secondary" />],
  ["1", ""],
  ["Log Out", <Logout color="secondary" />]
]

function Logo() {
  const theme = useTheme();

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
        color: theme.palette.text.secondary
        }}
        >
          
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
      <ThemeProvider theme={uTheme}>
        <CssBaseline />
          <DashModel 
          menuItems={menu} 
          logo={{
            title: 'AgendaRaven', 
            href: '/', 
            icon: <img src='../favicon.ico' width='32' height='32' alt='logo'/>
          }} 
          page={page}
          path={`/dashboard/`} 
          >
            {elementMap[page]}
          </DashModel>
      </ThemeProvider>
    </AuthCheck>
  )
}