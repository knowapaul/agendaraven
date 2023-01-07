// MUI Resources
import { IconButton, Snackbar, Alert } from "@mui/material";
import { Close } from "@mui/icons-material";


/**
 * @param  {Map} props React Props
 * 
 * text = {String} The alert's text
 * open = {Boolean} The open state of the snackbar
 * setOpen = {Function} The function to set the open value
 */
export function CustomSnackbar(props) {
    const close = () => {props.setOpen(false)}
    return (
        <Snackbar
        sx={{zIndex: '1201'}}
        open={props.open}
        onClose={close}
        autoHideDuration={3000}
        >

            <Alert severity="success" sx={{'& .MuiAlert-icon': {margin:'auto', mr: 2} }}>
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