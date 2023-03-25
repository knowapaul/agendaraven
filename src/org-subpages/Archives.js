import { FileOpen } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Confirm from "../components/Confirm";
import { CustomSnackbar } from "../components/CustomSnackbar";
import { deleteSchedule, getArchivedSchedules, unArchive } from "../resources/Firebase";
import { uTheme } from "../resources/Themes";

export default function Archives(props) {
    const [ data, setData ] = useState({});
    const [ anchorEl, setAnchorEl ] = useState();
    const [ pendDelete, setPendDelete ] = useState();
    const [ snackOpen, setSnackOpen ] = useState(false);
    const [ result, setResult ] = useState();
    const [ action, setAction ] = useState('');

    useEffect(() => {
        getArchivedSchedules(props.org)
            .then((tDat) => {
                console.log('tdat', tDat)
                setData(tDat)
            })
    }, [props.org])

    console.log('result', result, snackOpen)

    return (
        <Paper variant="outlined" sx={{margin: 2, padding: 2}}>
            <Typography variant='h5'>Archived Schedules</Typography>
                {Object.keys(data).length > 0
                ?
                <List>
                    {Object.keys(data).sort((a, b) => (data[b].timestamp - data[a].timestamp)).map((title) => (
                        <ListItem key={title} disablePadding>
                            <ListItemButton sx={{display: 'flex'}} onClick={(e) => {setAnchorEl(e.target)}}>
                                <ListItemIcon sx={{flex: 0}}>
                                    <FileOpen color="secondary" />
                                </ListItemIcon>
            
                                <ListItemText primary={title} sx={{flex: 1, color: uTheme.palette.primary.main}}/>
                                <ListItemText primary={data[title].type} sx={{flex: 1, color: uTheme.palette.primary.main}}/>
                                <ListItemText primary={new Date(data[title].timestamp).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})} sx={{flex: 1, color: uTheme.palette.primary.main}}/>
                            </ListItemButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => {setAnchorEl()}} keepMounted>
                                <MenuItem 
                                key={'unarchive'} 
                                onClick={() => {
                                    setAction('unarchived'); 
                                    setAnchorEl()
                                    unArchive(props.org, title)
                                        .then(() => {setResult('success'); setSnackOpen(true); })
                                        .catch(() => {setResult('error'); setSnackOpen(true); })
                                }}>
                                    <Typography textAlign="center">Unarchive</Typography>
                                </MenuItem>
                                <MenuItem key={'delete'} onClick={() => {setAnchorEl(); setAction('deleted'); setPendDelete(title)}}>
                                    <Typography textAlign="center">Delete</Typography>
                                </MenuItem>
                            </Menu>
                        </ListItem>
                    ))}
                </List>
                :
                <Typography sx={{margin: 2}}>
                    This folder is empty. In order to archive a schedule, go to its settings tab and click 'Archive'
                </Typography>
                }
            <Confirm 
            open={Boolean(pendDelete)} 
            message={`Are you sure you want to delete the schedule ${pendDelete}? This action cannot be undone.`} 
            handleResult={() => {deleteSchedule(props.org, pendDelete).then(() => {setResult('success'); setSnackOpen(true)}).catch(() => {setResult('error'); setSnackOpen(true)})} }
            handleClose={() => {setPendDelete()}}
            />
            <CustomSnackbar 
            text={`Schedule ${result === 'success' ? 'successfully' : 'could not be'} ${action}`}
            open={snackOpen}
            setOpen={setSnackOpen}
            severity={result}
            />
        </Paper>
    )
}