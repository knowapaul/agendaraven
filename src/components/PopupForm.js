import { ThemeProvider, useTheme } from "@emotion/react";
import { Paper, Backdrop, Typography, Button, ClickAwayListener, Box, IconButton, Stack } from "@mui/material";

import { useState } from "react";

import { mTheme } from '../resources/Themes'
import Form from "./Form";

import { CancelOutlined, Close } from "@mui/icons-material";
import { FbContext } from "../resources/Firebase";
import { getUserData } from "../resources/HandleDb";
import { useNavigate } from "react-router-dom";



export default function PopupForm(props) {
    const theme = useTheme();

    console.log('drawer', theme.zIndex.drawer)

    return (
        <Backdrop
        sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, position: "absolute", top: 0, left: 0 }}
        open={props.open}
        >
            {props.open ?
                <ClickAwayListener onClickAway={() => {props.setOpen(false)}}>
                    <Paper
                    sx={{
                        padding: 3, 
                        pt: 0, 
                        backgroundColor: theme.palette.secondary.main,
                        width: props.width
                    }}
                    >   
                        <IconButton sx={{ml: -3, height: "32px", width: "32px", float: 'left'}} onClick={() => {props.setOpen(false)}}>
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