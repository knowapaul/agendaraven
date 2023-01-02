// React Resources
import { useEffect, useRef, useState } from "react";

// MUI Resources
import { useTheme } from "@emotion/react";
import { Button, Box, Divider, Paper, Stack, Typography, IconButton, TextField, Snackbar, Fab, Alert, Input } from "@mui/material";
import { Circle, Clear, Close, Edit, Image, PictureAsPdf, Save, Upload } from "@mui/icons-material";

// Project Resources
import FriendlyLoad from "../components/FriendlyLoad";
import { FbContext } from "../resources/Firebase";
import { getMemo, setMemo } from "../resources/HandleDb";
import { setPersistence } from "firebase/auth";
import AdminCheck from "../components/AdminCheck";
import { getOrgFiles, uploadFile } from "../resources/HandleStorage";
import { getDownloadURL } from "firebase/storage";
import { CustomSnackbar } from "../components/CustomSnackbar";


function FileUpload(props) {
    const inputRef = useRef();
    const [ open, setOpen ] = useState(false);

    const handleUpload = () => {
        uploadFile(props.storage, inputRef.current.files.item(0), props.root, props.unique)
            .then(() => {
                setOpen(true)
                if (props.setRefresh) {
                    props.setRefresh(!props.refresh)
                }
            })
            .catch(() => {
                // TODO: Make this more friendly
                console.error('An error occurred while uploading the file')
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
            text={'File saved'}
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
            padding: 1,
            flexDirection: 'row'
        }}>
            <Box height={'162px'}>

            <FriendlyLoad 
            storage={props.storage}
            source={imagePath} 
            width={'288px'}
            height={'162px'}
            style={{ objectFit: 'cover', borderRadius: theme.shape.borderRadius}}
            deps={[refresh]}
            />
                <AdminCheck org={props.org}>
                    <FileUpload 
                    root={imagePath}
                    storage={props.storage} 
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

    return (
        <FbContext.Consumer>
            {firebase => {
                if (!updated) {
                    getMemo(firebase.db, props.org, setTitle, setPerson, setContents)
                        .then(() => {
                            setUpdated(true)
                        })
                }
                return (
                    <div>
                        <Header storage={props.storage} org={props.org} />
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
                                <Typography sx={{mt: 1}}>
                                    {contents}
                                </Typography>
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
                                                    firebase.db, 
                                                    props.org,
                                                    title, 
                                                    contents, 
                                                    firebase.auth.currentUser
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
                        text='Memo Saved'
                        open={open}
                        setOpen={setOpen}
                        />
                    </div>
                )
            }}
        </FbContext.Consumer>
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
        getOrgFiles(props.storage, props.org + '/', setFiles)
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
                storage={props.storage}
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
    const [ selected ] = useState('left')

    return (
        <FbContext.Consumer>
            {firebase => (
                <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} height={'100%'} overflow={'auto'}>
                    <Box 
                    width={{ xs: '100%', md: '50%'}}
                    display={{ xs: selected === 'left' ? 'block' : 'none', md: 'block' }}
                    >
                        <Left storage={firebase.storage} org={props.org} />
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
                        <Right storage={firebase.storage} org={props.org} />
                    </Box>
                </Box>
            )}
        </FbContext.Consumer>
    )
}