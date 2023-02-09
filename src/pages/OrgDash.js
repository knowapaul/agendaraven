// React Resources
import { useLoaderData, useNavigate } from "react-router-dom";

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { CalendarToday, Dashboard, DonutLarge, Groups, Home, Logout, Settings } from '@mui/icons-material';
import { CssBaseline } from "@mui/material";

// Project Resources
import { useEffect } from "react";
import AuthCheck from "../components/AuthCheck";
import DashModel from '../components/DashModel';
import OrgCheck from "../components/OrgCheck";
import OrgHome from "../org-subpages/OrgHome";
import OrgSettings from "../org-subpages/OrgSettings";
import People from "../org-subpages/People";
import Schedules from "../org-subpages/Schedules";
import { uTheme } from '../resources/Themes';


//  ["Availability", <EventAvailable color={'secondary'} />],

// ["Chat", <Message color={'secondary'} />],
// ["2" , ""],
// ["Insights", <Insights color={'secondary'} />],

const menu = [
  ["Home", <Home color="secondary"/>],
  ["Schedules", <CalendarToday color={'secondary'} />],
  ["People", <Groups color={'secondary'} />],
  ["Settings", <Settings color={'secondary'} />],
  ["3" , ""],
  ["My Dashboard", <Dashboard color={'secondary'} />],
  ["Log Out", <Logout color={'secondary'} />],
]

export async function orgLoader({ params }) {
    return [params.org, params.page];
}

function DashNavigate() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard')
  }, [])

  return <div></div>
}

export function OrgDash(props) {
  const [ org, page ] = useLoaderData();

  // chat: <Chat org={org} />,
  // insights: <OrgInsights />
  const elementMap = {
    people: <People org={org}/>,
    schedules: <Schedules org={org} />,
    home: <OrgHome org={org}/>,
    settings: <OrgSettings org={org} />,
    dashboard: <DashNavigate />
  };

  return (
    <AuthCheck>
      <OrgCheck org={org}>
        <ThemeProvider theme={uTheme}>
          <CssBaseline />
            <DashModel 
            menuItems={menu} 
            page={page} 
            title={page} 
            logo={{icon: <DonutLarge fontSize="large"/>, href: `/${org}/home`, title: org[0].toUpperCase() + org.slice(1), }} 
            path={`/${org}/`} 
            >
                {elementMap[page]}
            </DashModel>
        </ThemeProvider>
      </OrgCheck>
    </AuthCheck>
  )
}