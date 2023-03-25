// React Resources
import * as React from 'react';

// MUI Resources
import { ThemeProvider } from '@emotion/react';
import { DashboardCustomize, Logout } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';

// Project Resources
import { useLoaderData } from 'react-router-dom';
import AuthCheck from '../components/AuthCheck';
import DashModel from '../components/DashModel';
import { uTheme } from '../resources/Themes';
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

//     ["Account", <AccountCircle color="secondary" />],



const menu = [
    ["My Organizations", <DashboardCustomize color="secondary" />],
    ["1", ""],
    ["Log Out", <Logout color="secondary" />]
]


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
                        icon: <img src='/favicon.ico' width='48' height='48' alt='logo'/>
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