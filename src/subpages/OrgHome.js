// React Resources
import { useState } from "react";

// MUI Resources
import { useTheme } from "@emotion/react";
import { Button, Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { Circle } from "@mui/icons-material";

// Project Resources
import FriendlyLoad from "../components/FriendlyLoad";
import { FbContext } from "../resources/Firebase";


function Header(props) {
    const theme = useTheme();
    return (
        <Box sx={{
            width: '100%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 1,
        }}>
            <FriendlyLoad 
            storage={props.storage}
            source={'image.jpg'} 
            width={'288px'}
            height={'162px'}
            style={{ objectFit: 'cover', borderRadius: theme.shape.borderRadius}}
            />
        </Box>
    )
}

function Left(props) {
    return (
        <div>
            <Header storage={props.storage}/>
            <Paper sx={{mx: 2, padding: 2}}>
                <Typography
                variant="h5"
                fontWeight={'bold'}
                >
                    Title here
                </Typography>
                <Divider sx={{borderColor: 'white'}}/>

                <Typography
                variant="body2"
                >
                    Written by:
                </Typography>
                <Typography sx={{mt: 1}}>
                    lorem ipsum dolor sin amet
                    ipsum dolor sin amet
                    lorem dolor sin amet
                    lorem ipsum sin amet
                    lorem ipsum dolor amet
                    lorem ipsum dolor sin
                    lorem ipsum dolor sin amet
                    ipsum dolor sin amet
                    lorem dolor sin amet
                    lorem ipsum sin amet
                    lorem ipsum dolor amet
                    lorem ipsum dolor sin
                </Typography>
            </Paper>
        </div>
    )
}

function FileItem(props) {
    const theme = useTheme();
    return (
        <Button
        sx={{
            padding: 1, 
            display: 'flex', 
            flexDirection: 'row', 
            width: '100%', 
            textTransform: 'none', 
            justifyContent: 'left', 
            textAlign: 'left',
            borderRadius: 0,
            borderRight: {xs: `1px solid ${theme.palette.primary.main}`, md: 'none'},
            borderLeft: {xs: `1px solid ${theme.palette.primary.main}`, md: 'none'},
            borderBottom: `1px solid ${theme.palette.primary.main}`,
        }}
        >   
            <Box height={'100%'} padding={'auto'}>
                <Circle sx={{mr: 2}}/>
            </Box>
            <Box>
                <Typography
                variant={'h6'}
                >
                    {props.title}
                </Typography>
                <Typography
                variant={'subtitle1'}
                >
                    {props.description}
                </Typography>
            </Box>
        </Button>
    )
}

function Right(props) {
    const theme = useTheme();
    const [ files ] = useState({item1: ['description', 'link'], item2: ['description2', 'link2'], item3: ['description2', 'link2'], item4: ['description2', 'link2']})
    return (
        <Stack width={'100%'}>
            <Paper 
            sx={{
                borderTopLeftRadius: { xs: theme.shape.borderRadius, md: 0},
                borderTopRightRadius: { xs: theme.shape.borderRadius, md: 0},
                borderRadius: 0,
            }}
            >
                <Typography 
                variant="h5" 
                padding={1} 
                sx={{borderBottom: `1px solid ${theme.palette.primary.main}`}}
                >
                    Resources
                </Typography>
            </Paper>
            {Object.keys(files).map(key => (
                <FileItem title={key} description={files[key][0]} />
            )
            )}
        </Stack>
    )
}

export default function OrgHome(props) {
    const theme = useTheme();
    const [ selected ] = useState('left')

    return (
        <FbContext.Consumer>
            {firebase => (
                <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} height={'100%'} overflow={'auto'}>
                    <Box 
                    width={{ xs: '100%', md: '50%'}}
                    display={{ xs: selected === 'left' ? 'block' : 'none', md: 'block' }}
                    >
                        <Left storage={firebase.storage} />
                    </Box>
                    <Box 
                    width={{ xs: '100%', md: '50%'}} 
                    height={'100%'}
                    display={'flex'}
                    flexDirection={'row'}
                    padding={{ xs: 2, md: 0}}
                    >
                        <Box
                        width={'1px'}
                        display={{xs: `none`, md: 'block'}}
                        sx={{backgroundColor: theme.palette.primary.main}}
                        />
                        <Right />
                    </Box>
                </Box>
            )}
        </FbContext.Consumer>
    )
}