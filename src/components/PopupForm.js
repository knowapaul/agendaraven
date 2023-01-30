// MUI Resources
import { CancelOutlined } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { Paper, Backdrop, Typography, ClickAwayListener, Box, IconButton } from "@mui/material";


export default function PopupForm(props) {
    const theme = useTheme();

    return (
        <Backdrop
        sx={{ color: '#fff', position: "absolute", zIndex: "appBar", top: 0, left: 0 }}
        open={props.open}
        >
            {props.open ?
                <ClickAwayListener onClickAway={() => {props.setOpen(false)}}>
                    <Paper
                    sx={{
                        padding: 'min(24px, 5%)',
                        pt: 0, 
                        backgroundColor: theme.palette.secondary.main,
                        width: props.width,
                    }}
                    >   
                        <IconButton sx={{ml: 'max(-24px, -5%)', height: "32px", width: "32px", float: 'left'}} onClick={() => {props.setOpen(false)}}>
                            <CancelOutlined />
                        </IconButton>
                        <Typography
                        variant='h5'
                        sx={{margin: 1, textAlign: 'center'}}
                        >
                            {props.title}
                        </Typography>
                        <Box>
                            {props.children}
                        </Box>
                    </Paper>
                </ClickAwayListener> : '' 
            }
        </Backdrop>
    )
}