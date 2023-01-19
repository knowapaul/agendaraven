// React Resources
import { useEffect, useRef, useState } from "react";

// MUI Resources
import { useTheme } from "@emotion/react";
import { Clear, Edit, Image, PictureAsPdf, Save } from "@mui/icons-material";
import { Box, Button, Divider, Fab, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";

// Project Resources
import { getDownloadURL } from "firebase/storage";
import AdminCheck from "../components/AdminCheck";
import { CustomSnackbar } from "../components/CustomSnackbar";
import { ErrorBoundary } from "../components/ErrorBoundary";
import FriendlyLoad from "../components/FriendlyLoad";
import { getMemo, getOrgFiles, setMemo, uploadFile } from "../resources/Firebase";


function FileUpload(props) {
    const inputRef = useRef();
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState(false);

    const handleUpload = () => {
        uploadFile(inputRef.current.files.item(0), props.root, props.unique)
            .then(() => {
                setError(false);
                setOpen(true);
                if (props.setRefresh) {
                    props.setRefresh(true)
                }
            })
            .catch(() => {
                setError(true);
                setOpen(true);
            })
    }
    return (
        <Box width={'100%'}>
            <input 
            ref={inputRef}
            type="file" 
            accept={props.accept}
            onChange={handleUpload}
            style={{display: 'none'}}
            />
            {props.button === 'fill' 
            ?
            <Button sx={{width: '100%'}} onClick={() => {inputRef.current.click()}}>Upload File</Button>
            :
            <Fab sx={{mt: -11, ml: 1}} size='small' onClick={() => {inputRef.current.click()}}>
                <Edit />
            </Fab>
            }
            <CustomSnackbar
            text={error ? 'The file could not be saved' : 'File saved'}
            error={error ? 'error' : 'success'}
            open={open}
            setOpen={setOpen}
            />
        </Box>
    )
}

function Header(props) {
    const theme = useTheme();
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
            style={{ objectFit: 'cover', borderRadius: theme.shape.borderRadius}}
            refresh={refresh}
            setRefresh={setRefresh}
            />
                <AdminCheck org={props.org}>
                    <FileUpload 
                    root={imagePath}
                    accept={'.jpg'}
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
    const [ updated, setUpdated ] = useState(false);
    const [ open, setOpen ] = useState(false);

    useEffect(() => {
        getMemo(props.org, setTitle, setPerson, setContents)
    }, [])

    return (
        <div>
            <Header org={props.org} />
            <Paper sx={{mx: 2, padding: 2}}>
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
                            fontSize: '25px'
                        },
                        }}/>
                    <TextField 
                    multiline 
                    sx={{width: '100%', my: 1}} 
                    placeholder={'Memo contents'} 
                    value={contents}
                    onChange={e => {setContents(e.target.value)}}
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
                            <IconButton onClick={() => {setEdit(false); setUpdated(false)}}>
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
    const theme = useTheme();
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
            borderRight: {xs: `1px solid ${theme.palette.primary.main}`, md: 'none'},
            borderLeft: {xs: `1px solid ${theme.palette.primary.main}`, md: 'none'},
            borderBottom: `1px solid ${theme.palette.primary.main}`,
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
    const theme = useTheme();
    const [ files, setFiles ] = useState();
    const [ refresh, setRefresh ] = useState();

    useEffect(() => {
        getOrgFiles(props.org + '/', setFiles)
    }, [refresh])

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
                root={props.org + '/'}
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
    const theme = useTheme();

    return (
        <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row', }}  height={'calc(100% - 64px)'}  overflow={'auto'}>
            <Box 
            width={{ xs: '100%', md: '50%'}}            >
                <ErrorBoundary>
                    <Left org={props.org} />
                </ErrorBoundary>
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
                height={'100%'}
                sx={{backgroundColor: theme.palette.primary.main}}
                />
                <ErrorBoundary>
                    <Right org={props.org} />
                </ErrorBoundary>
            </Box>
        </Box>
    )
}