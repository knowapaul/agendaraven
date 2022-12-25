// React Resources
import { useState } from "react";

// MUI Resources
import { CircularProgress, Box, Typography } from "@mui/material";

// Project Resources
import { accessImage } from "../resources/HandleStorage";


/**
 * @param  {Map} props
 * 
 * Displays loading and errors for an image loaded from firebase storage
 * 
 * Passes all props to the image component to be loaded.
 * - props.source (image location in database) is required
 * - props.storage (firebase storage instance) is required
 * - props.alt is required
 * - props.height & props.width are preferred to set good dimensions
 */
export default function FriendlyLoad(props) {
    const [ source, setSource ] = useState();
    const [ fail, setFail ] = useState();

    accessImage(props.storage, props.source, setSource);

    setTimeout(() => {
        setFail(true);
    }, 7000)

    return (
        <Box 
        height={props.height}
        width={props.width}
        >
            {
            (source && source !== 'ERROR') 
            ?
            <img {...props} alt={props.alt} src={source} /> 
            : 
            <Box 
            backgroundColor="primary"
            display="flex" 
            alignItems="center"
            justifyContent="center"
            sx={{height: props.height}}
            >
                {
                ((source === 'ERROR') || fail)
                ? 
                <Typography>Error Loading Image</Typography> 
                :
                <CircularProgress color="secondary"/>
                }
            </Box>
            }
        </Box>
    )
}