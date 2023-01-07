// React Resources
import { useLoaderData } from "react-router-dom";

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Typography, Stack } from "@mui/material";
import { CalendarToday, Insights, Logout, Settings, Home, Message, DonutLarge, Groups } from '@mui/icons-material'

// Project Resources
import { wTheme } from '../resources/Themes'
import AuthCheck from "../components/AuthCheck";
import DashModel from '../components/DashModel'
import People from "../org-subpages/People";
import Schedules from "../org-subpages/Schedules";
import OrgHome from "../org-subpages/OrgHome";
import OrgSettings from "../org-subpages/OrgSettings";




//  ["Availability", <EventAvailable color={'secondary'} />],

// ["Chat", <Message color={'secondary'} />],
// ["2" , ""],
// ["Insights", <Insights color={'secondary'} />],

const menu = [
  ["Home", <Home color="secondary"/>],
  ["Schedules", <CalendarToday color={'secondary'} />],
  ["1" , ""],
  ["People", <Groups color={'secondary'} />],
  ["Settings", <Settings color={'secondary'} />],
  ["3" , ""],
  ["Log Out", <Logout color={'secondary'} />],
]

function Logo(props) {
  return (
    <Stack
      direction="row"
      spacing={2} 
      padding={1}
      height={'100%'}
      >
        <DonutLarge fontSize="large"/>
        <Typography
        variant="h6"
        noWrap
        component="a"
        sx={{
        fontFamily: 'quicksand',
        fontWeight: 700,
        letterSpacing: '.3rem',
        }}
        >
          {props.org[0].toUpperCase() + props.org.slice(1)}
        </Typography>
      </Stack>
  )
}

export async function orgLoader({ params }) {
    return [params.org, params.page];
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
  };

  return (
    <AuthCheck >
      <ThemeProvider theme={wTheme}>
        <CssBaseline />
          <DashModel 
          menuItems={menu} 
          page={page} 
          title={page} 
          logo={<Logo org={org}/>} 
          path={`/${org}/`} 
          >
            {elementMap[page]}
          </DashModel>
      </ThemeProvider>
    </AuthCheck>
  )
}