// MUI Resources
import { Box, Button, FormControlLabel, Paper, Radio, RadioGroup, TextField, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";

// Project Resources

// Other Resources
import { oTheme } from "../resources/Themes";


export default function AvFields(props) {
    const handleNewField = () => {
        if (props.avFields.length < 100) {
            let temp = props.avFields.map((item) => (item.title));
            let attempt;
            for (let i = 1; i < 105; i++) {
                attempt = 'Untitled-' + i;
                if (!temp.includes(attempt)) {
                    break;
                }
            }
            props.setAvFields(props.avFields.concat([{title: attempt, type: 'text'}]));
        }
    }
    return (
        <Box padding={1}>
            <Box display={'flex'} flexDirection='row' width={'100%'}>
                    <Box sx={{flex: 1}}>
                        <Button 
                        variant='contained'
                        onClick={handleNewField}
                        sx={{width: '150px'}}
                        >
                            Add Field  
                        </Button>
                    </Box>
                    <Box sx={{flex: 0}} >
                        <Button 
                        variant='contained' 
                        onClick={() => {props.setAvFields([])}}
                        sx={{width: '150px'}}
                        >
                            Clear All
                        </Button>
                    </Box>
                </Box>
            <ThemeProvider theme={oTheme}>
                
                {
                props.avFields[0]
                ?
                props.avFields.map((item, index) => (
                <Field 
                key={index} 
                item={item} 
                index={index}
                avFields={props.avFields} 
                setAvFields={props.setAvFields} 
                />
                ))
                :
                <Box >
                    <Paper sx={{padding: 1, margin: 1, height: '60px'}}>
                        <Typography>
                            Please add an availability field to continue
                        </Typography>
                    </Paper>
                </Box>
                }
            </ThemeProvider>
            <Box ml={2}>
                <Typography>
                    Due Date:
                </Typography>
                <TextField type='date' value={props.avDate} onChange={(e) => {props.setAvDate(e.target.value)}}/>
            </Box>
        </Box>
    )
}

function Field(props) {
    const [ title, setTitle ] = useState(props.avFields[props.index].title);
    function handleType(e) {
        let temp = [...props.avFields]
        temp[props.index] = Object.assign(props.item, {type: e.target.value})
        props.setAvFields(temp)
    }
    function handleTitle(e) {
        setTitle(e.target.value)
    }
    function handleBlur() {
        let checks = props.avFields.map((item) => (item.title));
        if (checks.includes(title) || !title) {
            setTitle(props.avFields[props.index].title)
        } else {
            let temp = [...props.avFields]
            temp[props.index] = Object.assign(props.item, {title: title})
            props.setAvFields(temp)
        }
    }

    return (
        <Paper
        variant={'outlined'}
        sx={{padding: 1, margin: 1}}
        >
            <TextField 
            variant='standard' 
            placeholder="Field Name"
            value={title}
            onChange={handleTitle}
            onBlur={handleBlur}
            />
            <RadioGroup
            row
                aria-labelledby="demo-radio-buttons-group-label"
                value={props.item.type}
                onChange={handleType}
                name="radio-buttons-group"
            >
                <FormControlLabel value="text" control={<Radio />} label="Text" />
                <FormControlLabel value="time" control={<Radio />} label="Time" />
                <FormControlLabel value="number" control={<Radio />} label="Number" />
            </RadioGroup>
        </Paper>
    )
}