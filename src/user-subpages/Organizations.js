// React Resources
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// MUI Resources
import { CircularProgress, Fab, Card, CardContent, Grid, Box, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'

// Project Resources
import CreateOrJoin from '../components/CreateOrJoin'
import { getCurrentAuth, getFirebase, getUserData } from "../resources/Firebase";
import { MiniLoad } from "../components/Loading";
import { useTheme } from "@emotion/react";
import FriendlyLoad from "../components/FriendlyLoad";
 

function OrgCard(props) {
    const [source, setSource] = useState('');
    const [fail, setFail] = useState(false);

    const theme = useTheme();

    setTimeout(() => {
        setFail(true);
    }, 7000)

    return (
        <Grid item
        xs={12} sm={12} md={6} lg={4} xl={3}
        >
            <Link to={`../${props.text}/home`}
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
                        {
                            <FriendlyLoad 
                            source={props.text + '/index/image.jpg'} 
                            width={'100%'}
                            style={{ objectFit: 'cover', borderRadius: theme.shape.borderRadius, aspectRatio: '16 / 9'}}
                            />
                        }
                    </CardContent>
                </Card>
            </Link>
        </Grid>
    )
}

function Add() {
    const [ open, setOpen ] = useState(false);
    const theme = useTheme();

    return (
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3} >
            <Box 
            width='100%'
            sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: theme.shape.borderRadius
              }}
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

export default function Organizations(props) {
    const [ orgs, setOrgs ] = useState({});

    useEffect(() => {
        getUserData()
            .then((data) => {
                setOrgs(data.orgs);
            })
    }, [])

    return (
        <Box height='calc(100vh - 64px)' overflow='auto' padding={2}>
            {orgs !== {} ? 
                <Grid container spacing={2}>
                    {Object.keys(orgs).map((text) => {
                        return (<OrgCard key={text} text={text} />)
                    })}
                    <Add />
                </Grid> :
                <MiniLoad />
            }
        </Box>
        
    )
}