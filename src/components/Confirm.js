import { Backdrop, Button, Paper, Typography } from "@mui/material";

/**
 * 
 * @param {*} props 
 * open
 * message
 * handleResult
 * handleClose
 */
export default function Confirm(props) {
    return (
        <Backdrop open={props.open} sx={{zIndex: 1300}}>
            <Paper sx={{padding: 2, width: '280px'}}>
                <Typography textAlign={'center'}>
                    {props.message}
                </Typography>
                <Button variant='contained' color="secondary" fullWidth sx={{m: 1}} onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant='contained' color="error" fullWidth sx={{m: 1}} onClick={() => {props.handleClose(); props.handleResult()}}>
                    Confirm
                </Button>
            </Paper>
        </Backdrop>
    )
}