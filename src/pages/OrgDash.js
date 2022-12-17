
import { ThemeProvider } from "@emotion/react";
import { Card, CardContent, CssBaseline, Box, Grid, Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import Nav  from '../components/Nav'
import { mTheme } from '../resources/Themes'
import { accessImage } from '../resources/HandleStorage'
import { StorageContext } from "../resources/Storage";
import { useState } from "react";
import Chat from "../components/Chat";
import ScheduleList from "../components/ScheduleList";
import { FbContext } from "../resources/Firebase";
import AuthCheck from "../components/AuthCheck";
import DashModel from '../components/DashModel'

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


// export function OrgDash(props) {
//     const [ source, setSource ] = useState('');

//     const org = useLoaderData();
 

//     return (
//       <AuthCheck >
//         <ThemeProvider theme={bTheme}>
//           <CssBaseline />
//           <Nav title={org} />
//           <FbContext.Consumer >
//               {firebase => {
//                   const storage = firebase.storage;
//                   accessImage(storage, 'image.jpg', setSource)
//                   return (
//                       <Box sx={{backgroundImage: `url(${source})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}}>
//                           <Grid container spacing={1} sx={{padding: 1}}>
//                           <GridItem title="Messages" md={6}><Chat org={org}/></GridItem>
//                           <GridItem title="Schedules" md={6}><ScheduleList /></GridItem>
//                           <GridItem title="Information" md={12}>Info</GridItem>
//                         </Grid>      
//                       </Box>
//                   )
//               }}
//           </FbContext.Consumer>
          
//         </ThemeProvider>
//       </AuthCheck>
//     )
// }


// <GridItem title="Schedules" md={6}><ScheduleList /></GridItem>
{/* <GridItem title="Information" md={12}>Info</GridItem> */}
export function OrgDash(props) {
  const [ source, setSource ] = useState('');

  const org = useLoaderData();


  return (
    <AuthCheck >
      <ThemeProvider theme={mTheme}>
        <CssBaseline />
        <FbContext.Consumer >
            {firebase => {
                const storage = firebase.storage;
                accessImage(storage, 'image.jpg', setSource)
                return (
                  <DashModel >
                    <Chat org={org}/>
                  </DashModel>
                )
            }}
        </FbContext.Consumer>
        
      </ThemeProvider>
    </AuthCheck>
  )
}