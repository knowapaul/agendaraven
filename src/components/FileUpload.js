// React Resources
import { useRef, useState } from "react";

// MUI Resources
import { Edit, Upload } from "@mui/icons-material";
import { Backdrop, Box, Button, Fab } from "@mui/material";

// Project Resources
import { CustomSnackbar } from "../components/CustomSnackbar";
import { uploadFile } from "../resources/Firebase";
import { MiniLoad } from "./Loading"


export function FileUpload(props) {
    const inputRef = useRef();
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(false);


    const handleUpload = () => {
        if ( inputRef.current.files[0]) {
            console.log('file', inputRef.current.files[0])
            setLoading(true)
            const completePath = props.path + (props.appendFileName ? inputRef.current.files[0].name : '')
            console.log('cpath', completePath)
            uploadFile(inputRef.current.files[0], completePath)
                .then((result) => {
                    console.log('result', result)
                    setError(false);
                    setOpen(true);
                    setLoading(false)
                    inputRef.value = ""
                    if (props.setRefresh) {
                        props.setRefresh(true)
                    }
                })
                .catch((error) => {
                    setError(true);
                    setOpen(true);
                    setLoading(false)
                    inputRef.value = ""
                    console.error(error)
                })
        }
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
            <Button sx={{width: '100%'}} onClick={() => {inputRef.current.click()}}><Upload sx={{mr: 1}} />Upload File</Button>
            :
            <Fab sx={{mt: -11, ml: 1}} size='small' onClick={() => {inputRef.current.click()}}>
                <Edit />
            </Fab>
            }
            <CustomSnackbar
            text={error ? 'The file could not be saved' : 'File saved'}
            severity={error ? 'error' : 'success'}
            open={open}
            setOpen={setOpen}
            />
            <Backdrop open={loading} sx={{position: 'fixed', zIndex: 1300}}>
                <MiniLoad text={'Uploading file...'} />
            </Backdrop>
        </Box>
    )
}