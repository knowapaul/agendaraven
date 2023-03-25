// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { Clear, Edit, Image, PictureAsPdf, Save } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";

// Project Resources
import { getDownloadURL } from "firebase/storage";
import AdminCheck from "../components/AdminCheck";
import { CustomSnackbar } from "../components/CustomSnackbar";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { FileUpload } from "../components/FileUpload";
import FriendlyLoad from "../components/FriendlyLoad";
import { getMemo, getOrgFiles, setMemo } from "../resources/Firebase";
import { uTheme } from "../resources/Themes";


function Header(props) {
    const imagePath = props.org + '/index/image.jpg';
    const [ refresh, setRefresh ] = useState();
    return (
        <Box sx={{
            width: '100%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 1,
            flexDirection: 'row'
        }}>
            <Box height={'162px'}>

            <FriendlyLoad 
            source={imagePath} 
            width={'288px'}
            height={'162px'}
            style={{ objectFit: 'cover', borderRadius: uTheme.shape.borderRadius}}
            refresh={refresh}
            setRefresh={setRefresh}
            alt={<img alt="default organization background" src='/abdfallback.png' width='288px' height='162px' />}
            />
                <AdminCheck org={props.org}>
                    <FileUpload 
                    root={imagePath}
                    accept={['.jpg', '.png', '.gif']}
                    unique={true} 
                    button='hover'
                    refresh={refresh}
                    setRefresh={setRefresh}
                    />
                </AdminCheck>
            </Box>
        </Box>
    )
}


function Left(props) {
    const [ edit, setEdit ] = useState();
    const [ title, setTitle ] = useState('');
    const [ contents, setContents ] = useState('');
    const [ person, setPerson ] = useState('');
    const [ open, setOpen ] = useState(false);

    useEffect(() => {
        getMemo(props.org, setTitle, setPerson, setContents)
    }, [props.org])

    return (
        <div>
            <Header org={props.org} />
            <Paper sx={{mx: 2, my: 1, padding: 2}}>
                {edit ? 
                <div>
                    <TextField 
                    placeholder="Memo Title" 
                    variant="standard"
                    sx={{my: 1}} 
                    value={title}
                    onChange={e => {setTitle(e.target.value)}}
                    inputProps={{
                        style: {
                            fontSize: '25px',
                            color: uTheme.palette.background.default
                        },
                        }}/>
                    <TextField 
                    multiline 
                    sx={{width: '100%', my: 1}} 
                    placeholder={'Memo contents'} 
                    value={contents}
                    onChange={e => {setContents(e.target.value)}}
                    inputProps={{
                        style: {
                            color: uTheme.palette.background.default
                        },
                        }}
                    />
                </div>
                : 
                <div>
                    <Typography
                    variant="h5"
                    fontWeight={'bold'}
                    >
                        {title}
                    </Typography>
                    <Typography
                    variant="body2"
                    >
                        Written by {person}
                    </Typography>
                    <Divider sx={{borderColor: 'white'}}/>
                    {contents ? 
                    contents.split('\n').map((paragraph, index) => (
                        <Typography key={index} sx={{mt: 1}} minHeight={'1em'}>
                            {paragraph}
                        </Typography>
                    ))
                    :
                    ''
                    }
                </div>
                }
                <Box width={'100%'} display={'flex'} >
                    <Box flex={1} />
                    <Box flex={0} >
                        {edit 
                        ?
                        <Box display={'flex'} flexDirection={'row'}>
                            <IconButton onClick={
                                () => {
                                    setMemo(
                                        props.org,
                                        title, 
                                        contents, 
                                    ).then(() => {
                                        setOpen(true)
                                    })
                                }
                                }>
                                <Save color="secondary" />
                            </IconButton>
                            <IconButton onClick={() => {setEdit(false)}}>
                                <Clear color="secondary" />
                            </IconButton>
                        </Box>
                        :
                            <AdminCheck org={props.org}>
                                <IconButton onClick={() => {setEdit(true)}}>
                                    <Edit color="secondary" />
                                </IconButton>
                            </AdminCheck>
                        }
                    </Box>
                </Box>
            </Paper>
            <CustomSnackbar
            severity={'success'}
            text='Memo Saved'
            open={open}
            setOpen={setOpen}
            />
        </div>
    )
}


function FileItem(props) {
    const [ url, setUrl ] = useState();
    getDownloadURL(props.item).then((url) => {
        setUrl(url)
    })

    const icons = {
        pdf: <PictureAsPdf sx={{mr: 2}} />,
        jpg: <Image sx={{mr: 2}} />,
        png: <Image sx={{mr: 2}} />
    }

    return (
        <Button
        href={url}
        LinkComponent='a'
        target='_blank'
        rel='noreferrer noopener'
        sx={{
            padding: 1, 
            display: 'flex', 
            flexDirection: 'row', 
            width: '100%', 
            textTransform: 'none', 
            justifyContent: 'left', 
            textAlign: 'left',
            borderRadius: 0,
            borderRight: `1px solid ${uTheme.palette.primary.main}`,
            borderLeft: `1px solid ${uTheme.palette.primary.main}`,
            borderBottom: `1px solid ${uTheme.palette.primary.main}`,
        }}
        >   
            <Box height={'100%'} padding={'auto'}>
                {icons[props.item.name.slice(props.item.name.indexOf('.') + 1)]}
            </Box>
            <Box>
                <Typography
                variant={'h6'}
                >
                    {props.item.name.slice(0, props.item.name.indexOf('.'))}
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
    const [ files, setFiles ] = useState();
    const [ refresh, setRefresh ] = useState();

    useEffect(() => {
        getOrgFiles(props.org + '/', setFiles)
    }, [refresh, props.org])

    return (
        <Stack width={'100%'}>
            <Paper 
            sx={{
                borderTopLeftRadius: { xs: uTheme.shape.borderRadius, md: 0},
                borderTopRightRadius: { xs: uTheme.shape.borderRadius, md: 0},
                borderRadius: 0,
            }}
            >
                <Typography 
                variant="h5" 
                padding={1} 
                sx={{borderBottom: `1px solid ${uTheme.palette.primary.main}`}}
                >
                    Resources
                </Typography>
            </Paper>
            {files ?
            Object.keys(files).map(index => (
                    <FileItem 
                    key={files[index].name}
                    item={files[index]}
                    />
            ))
            :
            ''
            }

            <AdminCheck
            org={props.org}
            >
                <FileUpload 
                appendFileName
                path={props.org + '/'}
                button={"fill"}
                accept={'.jpg,.png,.pdf'}
                refresh={refresh}
                setRefresh={setRefresh}
                />
            </AdminCheck>
        </Stack>
    )
}

export default function OrgHome(props) {
    return (
        <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row', }}>
            <Box 
            width={{ xs: '100%', md: '50%'}}            >
                <ErrorBoundary>
                    <Left org={props.org} />
                </ErrorBoundary>
            </Box>
            <Box 
            width={{ xs: '100%', md: '50%'}} 
            display={'flex'}
            flexDirection={'row'}
            padding={{ xs: 2, md: 0}}
            >
                <ErrorBoundary>
                    <Right org={props.org} />
                </ErrorBoundary>
            </Box>
        </Box>
    )
}