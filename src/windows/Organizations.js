import { Card, CardContent, Grid, Box, Typography } from "@mui/material";
import { useState } from "react";
import { accessImage } from "../resources/HandleStorage";
import { StorageContext } from "../resources/Storage";
import { CircularProgress } from "@mui/material"
import { Link } from "react-router-dom";
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Container } from "@mui/system";
import CreateOrJoin from '../components/CreateOrJoin'
 
function OrgCard(props) {
    const [source, setSource] = useState('');
    const [fail, setFail] = useState(false);

    accessImage(props.storage, 'image.jpg', setSource);

    setTimeout(() => {
        setFail(true);
    }, 7000)

    return (
        <Grid item
        xs={12} sm={12} md={6} lg={4} xl={3}
        >
            <Link to={'../' + props.text}
            style={{textDecoration: 'none'}}
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
                        {(source && source !== 'ERROR') ? <img alt={props.text + ' background'} src={source} className="orgImg" /> : 
                        <Box 
                        className="orgImg"
                        backgroundColor="primary"
                        display="flex" 
                        alignItems="center"
                        justifyContent="center"
                        >
                            {(fail || source === 'ERROR') ? <Typography>Error Loading Image</Typography> :
                            <CircularProgress color="secondary"/>
                            }
                        </Box>
                        }
                        <Typography
                        sx={{float: 'right'}}
                        >
                            Roles: user, admin
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
        </Grid>
    )
}

function Add() {
    const [open, setOpen] = useState(false)

    return (
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            <Box 
            width='100%'
            className="orgImg"
            display="flex" 
            alignItems="center"
            justifyContent="center"
            >
                <Fab 
                variant="extended" 
                color="secondary" 
                aria-label="add" 
                sx={{mt: 3}} 
                onClick={() => {setOpen(true)}}
                >
                    <AddIcon  />
                    <Typography
                    ml={1}
                    >
                        Create or Join
                    </Typography>
                </Fab>

                <CreateOrJoin open={open} setOpen={setOpen} />
            </Box>
        </Grid>
    )
}

export default function Organizations() {
    return (
        <StorageContext.Consumer>
            {storage => (
                <Grid container spacing={3}>
                    {['card1', 'card2', 'card3'].map((text) => {
                        return (<OrgCard key={text} text={text} storage={storage}/>)
                    })}
                    <Add />
                </Grid>
            )}
        </StorageContext.Consumer>
    )
}