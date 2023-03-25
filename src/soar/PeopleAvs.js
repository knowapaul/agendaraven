import { Check, Clear, Edit, Save } from "@mui/icons-material";
import { ClickAwayListener, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getAllAvs, saveAvailability } from "../resources/Firebase";
import { uTheme } from "../resources/Themes";


function Person(props) {
    const [ edit, setEdit ] = useState(false);
    const [ data, setData ] = useState({});
    const [ myAv, setMyAv ] = useState({});


    useEffect(() => {
        setData(myAv[props.title] || {})
    }, [myAv, props.title])

    useEffect(() => {
        setMyAv(props.avs[props.people[props.person].uid] || {})
    }, [props.avs, props.people, props.person])

    return (
        <ClickAwayListener onClickAway={() => {setEdit(false)}}>
            <Paper variant={'outlined'} sx={{height: '100%'}}>
                <Box padding={2}>
                    <Box display={'flex'} flexDirection='row'>
                        <Box flex={1}>
                            <Typography  sx={{fontWeight: 'bold'}}>
                                {props.person}
                            </Typography>
                            <Stack direction={'row'}>
                                <Check fontSize="small" sx={{ display: myAv[props.title] ? 'initial' : 'none'}}/>
                                <Clear fontSize="small" sx={{ display: myAv[props.title] ? 'none' : 'initial'}}/>
                                <Typography variant="body2" sx={{ml: 1}}>
                                    {myAv[props.title] ? 'Submitted' : 'Not Submitted'}
                                </Typography>
                            </Stack>

                        </Box>
                        {edit ? 
                        <IconButton 
                        sx={{width: '48px', height: '48px'}}
                        onClick={() => {saveAvailability(props.org, props.title, data, props.people[props.person].uid).then(() => {setEdit(false); getAllAvs(props.org, props.setAllAvs, true)})}}
                        >
                            <Save />
                        </IconButton>
                        :
                        <IconButton sx={{width: '48px', height: '48px'}} onClick={() => {setEdit(true)}}>
                            <Edit />
                        </IconButton>
                        }
                    </Box>
                    
                    {
                        props.avs ?
                            <Grid container>
                                {props.avFields.map((item) => (
                                    <Grid item key={item.title} xs={6} sx={{padding: 1}}>
                                        <Typography fontWeight={'bold'} color={ myAv[props.title] ? uTheme.palette.primary.main : 'lightgrey'}>
                                            {item.title}
                                        </Typography>
                                        {edit ?
                                        <TextField 
                                        value={data[item.title] || ''}
                                        onChange={(e) => {let temp = {...data}; temp[item.title] = e.target.value; setData(temp)}}
                                        type={item.type}
                                        placeholder={item.type.toUpperCase()}
                                        />
                                            :
                                        <Typography>
                                            {myAv[props.title] ? myAv[props.title][item.title] || '---' : '---'}
                                        </Typography>
                                        }
                                    </Grid>
                                    )
                                )}
                            </Grid>
                        :
                        'not loaded yet'
                    }
                </Box>
            </Paper>
        </ClickAwayListener>
    )
}

export default function PeopleAvs(props) {
    return (
        <Grid container width={'100%'}>
            {
                props.people ?
                Object.keys(props.people).sort().map(person => (
                    <Grid item sx={{padding: 1}} key={person} xs={12} sm={6} md={4} lg={3} >
                        <Person {...props} person={person}/>
                    </Grid>
                ))
                :
                ''
            }
        </Grid>
    )
}