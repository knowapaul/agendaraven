// MUI Resources
import { IconButton, Snackbar, Alert, useMediaQuery } from "@mui/material";
import { Close } from "@mui/icons-material";


/**
 * @param  {Map} props React Props
 * 
 * text = {String} The alert's text
 * open = {Boolean} The open state of the snackbar
 * setOpen = {Function} The function to set the open value
 * severity = {String} The alert's severity
 * timeout? = {Number} Milliseconds until auto hide (3000 default)
 */
export function CustomSnackbar(props) {
    const matches = useMediaQuery('(min-width:600px)');
    const close = () => {props.setOpen(false)}
    return (
        <Snackbar
        sx={{zIndex: '1201'}}
        open={props.open}
        onClose={close}
        anchorOrigin={{ vertical: matches ? 'bottom' : 'top', horizontal: matches ? 'left' : 'right'}}
         
        autoHideDuration={props.timeout || 3000}
        >

            <Alert severity={props.severity} sx={{'& .MuiAlert-icon': {margin:'auto', mr: 2} }}>
                    {props.text}
                    <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={close}
                    sx={{ml: 2}}

                    >
                        <Close />
                </IconButton>
            </Alert>
            
        </Snackbar>
    )
}