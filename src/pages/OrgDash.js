
import { ThemeProvider } from "@emotion/react";
import { Card, CardContent, CssBaseline, Paper, Grid, Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import Nav  from '../components/Nav'
import { bTheme } from '../resources/Themes'
import { accessImage } from '../resources/HandleStorage'
import { StorageContext } from "../resources/Storage";
import { useState } from "react";
import Chat from "../components/Chat";
import ScheduleList from "../components/ScheduleList";
import { FbContext } from "../resources/Firebase";
import AuthCheck from "../components/AuthCheck";

export async function orgLoader({ params }) {
    return params.org;
  }



function GridItem(props) {
  return (
    <Grid item
    xs={12} sm={12} md={props.md} lg={4} xl={3}>
      <Card>
          <Typography variant="h6" ml={1}>
          </Typography>
          {props.children}
      </Card>
    </Grid>
  )
}


export function OrgDash(props) {
    const [ source, setSource ] = useState('');

    const org = useLoaderData();
 

    return (
      <AuthCheck >
        <ThemeProvider theme={bTheme}>
          <CssBaseline />
          <Nav />
          <FbContext.Consumer >
              {firebase => {
                  const storage = firebase.storage;
                  accessImage(storage, 'image.jpg', setSource)
                  return (
                      <div>
                        <img src={source} className='orgBg' />                      
                      </div>
                  )
              }}
          </FbContext.Consumer>
          <Grid container spacing={1} sx={{padding: 1}}>
            <GridItem title="Messages" md={6}><Chat org={org}/></GridItem>
            <GridItem title="Schedules" md={6}><ScheduleList /></GridItem>
            <GridItem title="Information" md={12}>Info</GridItem>
          </Grid>
        </ThemeProvider>
      </AuthCheck>
    )
}