// MUI Resources
import { Box, Button, FormControlLabel, Paper, Radio, RadioGroup, TextField, ThemeProvider, Typography } from "@mui/material";

// Project Resources

// Other Resources
import { oTheme } from "../resources/Themes";


export default function AvFields(props) {
    return (
        <Box padding={1}>
            <Box display={'flex'} flexDirection='row' width={'100%'}>
                    <Box sx={{flex: 1}}>
                        <Button 
                        variant='contained'
                        onClick={() => {props.setAvFields(props.avFields.concat([{title: 'Title', type: 'time'}]))}}
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
    function handleType(type, e) {
        let temporary = [...props.avFields]
        temporary[props.index] = Object.assign(props.item, {[type]: e.target.value})
        props.setAvFields(temporary)
    }

    return (
        <Paper
        variant={'outlined'}
        sx={{padding: 1, margin: 1}}
        >
            <TextField 
            variant='standard' 
            placeholder="Field Name"
            value={props.item.title}
            onChange={(e) => {handleType('title', e)}}
            />
            <RadioGroup
            row
                aria-labelledby="demo-radio-buttons-group-label"
                value={props.item.type}
                onChange={(e) => {handleType('type', e)}}
                name="radio-buttons-group"
            >
                <FormControlLabel value="time" control={<Radio />} label="Time" />
                <FormControlLabel value="text" control={<Radio />} label="Text" />
                <FormControlLabel value="number" control={<Radio />} label="Number" />
            </RadioGroup>
        </Paper>
    )
}