import { useTheme } from "@emotion/react";
import { Edit, Save } from "@mui/icons-material";
import { ClickAwayListener, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getAllAvs, saveAvailability } from "../resources/Firebase";


function Person(props) {
    const [ edit, setEdit ] = useState(false);
    const theme = useTheme();
    const [ data, setData ] = useState({})

    let iAv;
    if (props.avs) {
        iAv = props.avs[props.people[props.person].email]
        
    }
    useEffect(() => {
        if (iAv) {
            setData(iAv[props.title] || {})
        }
    }, [])
    if (!iAv) {iAv = []}

    return (
        <ClickAwayListener onClickAway={() => {setEdit(false)}}>
            <Paper variant={'outlined'} sx={{height: '100%'}}>
                <Box padding={2}>
                    <Box display={'flex'} flexDirection='row'>
                        <Box flex={1}>
                            <Typography  sx={{fontWeight: 'bold'}}>
                                {props.person}
                            </Typography>
                            <Typography>
                                {props.people[props.person].email}
                            </Typography>
                        </Box>
                        {edit ? 
                        <IconButton 
                        sx={{width: '48px', height: '48px'}}
                        onClick={() => {saveAvailability(props.org, props.title, data, props.people[props.person].email).then(() => {setEdit(false); getAllAvs(props.org, props.setAllAvs, true)})}}
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
                                        <Typography fontWeight={'bold'} color={ iAv[props.title] ? theme.palette.text.primary : 'lightgrey'}>
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
                                            {iAv[props.title] ? iAv[props.title][item.title] || '---' : '---'}
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
        <Grid container width={'100%'} height={'100%'} overflow={'auto'}>
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