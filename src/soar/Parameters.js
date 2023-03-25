import { Button, FormControlLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import PopupForm from '../components/PopupForm';
import { uTheme } from "../resources/Themes";

function Person(props) {

    const handleSaveData = (title) => (e) => {
        let temp = {...props.params}; 
        if (!temp[props.people[props.person].uid]) {
            temp[props.people[props.person].uid] = {}
        }
        temp[props.people[props.person].uid][title] = e.target.value;
        props.setParams(temp)
    }

    return (
        <Paper variant={'outlined'} sx={{height: '100%'}}>
            <Box padding={2}>
                <Box display={'flex'} flexDirection='row' mb={1}>
                    <Typography  sx={{fontWeight: 'bold'}}>
                        {props.person}
                    </Typography>
                </Box>
                
                {
                    props.params ?
                        <Grid container>
                            {props.paramFields.map((item) => (
                                <Grid item key={item.title} xs={6} sx={{padding: 1}}>
                                    <Typography fontWeight={'bold'} color={uTheme.palette.primary.main}>
                                        {item.title}
                                    </Typography>
                                    <TextField 
                                    variant="standard"
                                    value={
                                        props.params[props.people[props.person].uid] ? 
                                        props.params[props.people[props.person].uid][item.title] || '' 
                                        : ''
                                    }
                                    onChange={handleSaveData(item.title)}
                                    type={item.type}
                                    placeholder={item.type.toUpperCase()}
                                    />
                                </Grid>
                                )
                            )}
                        </Grid>
                    :
                    'Data not loaded yet'
                }
            </Box>
        </Paper>
    )
}

export default function Parameters(props) {
    const [ open, setOpen ] = useState(false);
    const [ title, setTitle ] = useState('');
    const [ type, setType ] = useState("time");

    const handleField = () => {
        if (title) {
            props.setParamFields(props.paramFields.concat({title: title, type: type}))
            setTitle('')
            setOpen(false)
        }
    }
    
    return (
        <div>
            <Button variant="contained" sx={{margin: 1}} onClick={() => {setOpen(true)}}>
                Add Field
            </Button>
            <PopupForm
            open={open}
            setOpen={setOpen}
            title={'New Field'}
            >
                <TextField 
                variant='outlined' 
                placeholder="Name your field"
                label="Field Name"
                value={title}
                onChange={(e) => {setTitle(e.target.value)}}
                />
                <Box sx={{border: `1px solid ${uTheme.palette.primary.main}`, borderRadius: 2, padding: 2, my: 2}} >
                    <Typography variant="h6">
                        Type
                    </Typography>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={type}
                        onChange={(e) => {setType(e.target.value)}}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="time" control={<Radio />} label="Time" />
                        <FormControlLabel value="text" control={<Radio />} label="Text" />
                        <FormControlLabel value="number" control={<Radio />} label="Number" />
                    </RadioGroup>
                </Box>
                <Button variant="contained" sx={{width: '100%'}} onClick={handleField}>
                    Add Field
                </Button>
            </PopupForm>

            <Grid container width={'100%'} maxHeight={'100%'} overflow={'auto'}>
                {
                    props.people ?
                    Object.keys(props.people).sort().map(person => (
                        <Grid item sx={{padding: 1}} key={person} xs={12} sm={12} md={6} lg={4} >
                            <Person {...props} person={person}/>
                        </Grid>
                    ))
                    :
                    ''
                }
            </Grid>
        </div>
    )
}