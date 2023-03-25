// React Resources
import { useRef, useState } from "react";

// MUI Resources
import { Edit, Upload } from "@mui/icons-material";
import { Box, Button, Fab } from "@mui/material";

// Project Resources
import { CustomSnackbar } from "../components/CustomSnackbar";
import { uploadFile } from "../resources/Firebase";


export function FileUpload(props) {
    const inputRef = useRef();
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState(false);

    const handleUpload = () => {
        uploadFile(inputRef.current.files.item(0), props.path)
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
            <Button sx={{width: '100%'}} onClick={() => {inputRef.current.click()}}><Upload sx={{mr: 1}} />Upload File</Button>
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