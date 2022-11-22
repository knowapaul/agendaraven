import { Card, CardContent, Grid, Box, Typography } from "@mui/material";
import { useState } from "react";
import { accessImage } from "../resources/HandleStorage";
import { StorageContext } from "../Storage";
import { CircularProgress } from "@mui/material"

function OrgCard(props) {
    const [source, setSource] = useState('');

    accessImage(props.storage, 'ORG1/image.jpg', setSource);

    return (
        <Grid item
        xs={6} sm={12} md={6} lg={4} xl={3}
        >
            <Card >
                <CardContent  sx={{padding: 1}} 
                color="primary"
                >
                    <Typography
                    variant='h6'
                    >
                        {props.text}
                    </Typography>
                    {source ? <img src={source} className="orgImg" /> : 
                    <Box 
                    className="orgImg"
                    backgroundColor="primary"
                    display="flex" 
                    alignItems="center"
                    justifyContent="center"
                    >
                        <CircularProgress color="secondary"/>
                    </Box>
                    }
                    <Typography
                    sx={{float: 'right'}}
                    >
                        Roles: user, admin
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}


export default function Organizations() {
    return (
        <StorageContext.Consumer>
            {storage => (
                <Grid container spacing={3}>
                    {
                    ['card1', 'card2', 'card3'].map((text) => {
                        return (<OrgCard text={text} storage={storage}/>)
                    }   
                    )
                    
                    }
                </Grid>
            )}
        </StorageContext.Consumer>
    )
}