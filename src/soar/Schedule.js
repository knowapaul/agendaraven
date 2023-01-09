// MUI Resources
import { Accessibility, Clear, EventAvailable, ImportantDevices, Notifications } from "@mui/icons-material";
import { Box, Button, Fab, FormControl, FormControlLabel, FormLabel, Grid, Icon, IconButton, Paper, Radio, RadioGroup, Stack, TextField, ThemeProvider, Typography, useScrollTrigger } from "@mui/material";

// Project Resources
import { MenuIcon } from './MenuIcon'

// Other Resources
import { DeleteBucket, PersonBucket, FieldBucket } from './Buckets'
import { Bottom } from './Headers'
import { useState } from "react";
import { bTheme, oTheme, wTheme } from "../resources/Themes";


function DisplaySchedule(props) {
    const handleDelete = (index, field) => {
        let adapted = [...props.items];
        delete adapted[index][field];
        props.setItems(adapted)
    }
    return (
        props.fields[0]
        ?
        <Box display={'flex'} flexDirection={'row'} height={'100%'} ml='20px'>
            {props.fields.map((field, oIndex) => (
                <Box flex={1} key={oIndex} height={'100%'}>
                    <FieldBucket 
                    item={field}
                    fields={props.fields} 
                    setFields={props.setFields} 
                    index={oIndex}
                    outlined
                    >
                        {props.items[0]
                        ?
                        props.items.map((person, iIndex) => {
                            return (
                                <Box key={iIndex} minHeight={'50px'} sx={{border: '1px solid black', margin: 1}}>
                                    {person[field]
                                    ?
                                    <Box display='flex' flexDirection={'row'}>
                                        <IconButton onClick={() => {handleDelete(iIndex, field)}} sx={{width: '40px', height: '40px', margin: '5px'}}>
                                            <Clear sx={{float: 'right'}}/>
                                        </IconButton>
                                        <Typography sx={{margin: 'auto', lineHeight: '50px'}}>
                                            {person[field]}
                                        </Typography>
                                    </Box>
                                    :
                                    <PersonBucket 
                                    item={person[field]}
                                    items={props.items} 
                                    setItems={props.setItems} 
                                    index={iIndex}
                                    parent={field}
                                    />
                                    }
                                </Box>
                            )
                        })
                        :
                        ''
                        }
                        <Box item key={'new' + oIndex} minHeight={'50px'} sx={{border: '1px dotted grey', margin: 1}}>
                            <PersonBucket
                            key={props.items.length} 
                            index={props.items.length}
                            parent={field}
                            item={props.items[props.items.length]}
                            items={props.items} 
                            setItems={props.setItems} 
                            />
                        </Box>
                    </FieldBucket>
                </Box>
                
            ))
            }
            <FieldBucket index={props.fields.length + 1} fields={props.fields} setFields={props.setFields}>
                <Box width={'50px'} height={'100%'}/>
            </FieldBucket>
        </Box>
        :
        <FieldBucket index={0} fields={props.fields} setFields={props.setFields} >
            Drag a field here to begin
        </FieldBucket>
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

function Availability(props) {
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
                        Please add an availability field to continue
                    </Paper>
                </Box>
                }
            </ThemeProvider>
            <Box ml={2}>
                <Typography>
                    Due Date:
                </Typography>
                <TextField type='date' onChange={(e) => {props.setAvDate(e.target.value)}}/>
            </Box>
        </Box>
    )
}

// Format of fields:
// {List} with no duplicates
export function Schedule(props) {
    const [ av, setAv ] = useState(false);

    console.log('sch', props)

    return (
        <Box flex={1} >
            <Box height={'calc(100% - 54px)'} width={'100%'} >
                {av 
                ?
                <Availability avFields={props.avFields} setAvFields={props.setAvFields} setAvDate={props.setAvDate} />
                :
                <DisplaySchedule {...props} />
                }
            </Box>
            <Bottom 
            right={
                <DeleteBucket fields={props.fields} setFields={props.setFields} />
            }
            >
                <Box display={'flex'} >
                    <MenuIcon title="Availability" flex={1} handleClick={() => {setAv(!av)}} >
                        <EventAvailable />
                    </MenuIcon>
                    <MenuIcon title="Data Import" flex={1}>
                        <ImportantDevices />
                    </MenuIcon>
                    <MenuIcon title="Templates" flex={1}>
                        <EventAvailable />
                    </MenuIcon>
                    <MenuIcon title="Notifications" flex={1}>
                        <Notifications />
                    </MenuIcon>
                    <MenuIcon title="Access" flex={1}>
                        <Accessibility />
                    </MenuIcon>
                </Box>
            </Bottom>
        </Box>
    )
}