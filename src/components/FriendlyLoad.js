// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { CircularProgress, Box, Typography } from "@mui/material";

// Project Resources
import { accessImage } from "../resources/Firebase";


/**
 * @param  {Map} props
 * 
 * Displays loading and errors for an image loaded from firebase storage
 * 
 * Passes all props to the image component to be loaded.
 * - source (image location in database) 
 * - storage (firebase storage instance)
 * - alt 
 * - height & width are preferred to set good dimensions
 * - *deps* = {List} Refresh when one of these changes
 */
export default function FriendlyLoad(props) {
    const [ source, setSource ] = useState();
    const [ fail, setFail ] = useState();

    useEffect(() => {
        accessImage(props.source, setSource);
    }, props.deps)

    setTimeout(() => {
        setFail(true);
    }, 7000)

    return (
        <Box 
        height={props.height}
        width={props.width}
        sx={{aspectRatio: props.style.aspectRatio}}
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