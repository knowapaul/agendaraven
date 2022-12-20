
import { ThemeProvider } from "@emotion/react";
import { Card, CardContent, CssBaseline, Box, Grid, Typography, List, MenuItem, Divider, Stack } from "@mui/material";
import { AccountCircle, CalendarToday, DashboardCustomize, EventAvailable, Insights, Mail, Payments, Logout, Schedule, Settings, Home, Message, DonutLarge, Groups } from '@mui/icons-material'

import { useLoaderData } from "react-router-dom";
import Nav  from '../components/Nav'
import { wTheme } from '../resources/Themes'
import { accessImage } from '../resources/HandleStorage'
import { StorageContext } from "../resources/Storage";
import { useState } from "react";
import Chat from '../components/Chat'
import ScheduleList from "../components/ScheduleList";
import { FbContext } from "../resources/Firebase";
import AuthCheck from "../components/AuthCheck";
import DashModel from '../components/DashModel'
import People from "../components/People";

export async function orgLoader({ params }) {
    return [params.org, params.page];
  }

const menu = [
  ["Home", <Home color="secondary"/>],
  ["Chat", <Message color={'secondary'} />],
  ["Schedules", <Schedule color={'secondary'} />],
  ["Availability", <EventAvailable color={'secondary'} />],
  ["1" , ""],
  ["Insights", <Insights color={'secondary'} />],
  ["2" , ""],
  ["People", <Groups color={'secondary'} />],
  ["Settings", <Settings color={'secondary'} />],
  ["3" , ""],
  ["Log Out", <Logout color={'secondary'} />],
]

function Logo() {
  const [ org, page ] = useLoaderData();
  return (
    <Stack
      direction="row"
      spacing={2} 
      margin={1}
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
          {org[0].toUpperCase() + org.slice(1)}
        </Typography>
      </Stack>
  )
}

export function OrgDash(props) {
  const [ org, page ] = useLoaderData();

  const elementMap = {
    chat: <Chat org={org} />,
    people: <People org={org}/>
  };

  return (
    <AuthCheck >
      <ThemeProvider theme={wTheme}>
        <CssBaseline />
        <FbContext.Consumer >
            {firebase => {
                // const storage = firebase.storage;
                // accessImage(storage, 'image.jpg', setSource)
                return (
                  <DashModel menuItems={menu} menuColor="secondary" title={page} logo={<Logo />} path={`/${org}/`} >
                    {elementMap[page]}
                  </DashModel>
                )
            }}
        </FbContext.Consumer>
        
      </ThemeProvider>
    </AuthCheck>
  )
}