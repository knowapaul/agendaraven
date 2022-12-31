// React Resources
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd'

// MUI Resources
import { ThemeProvider, useTheme } from "@emotion/react";
import { Accessibility, Delete, Download, EventAvailable, GridOn, Group, ImportantDevices, Notifications, Redo, Save, Undo } from "@mui/icons-material";
import { Box, Button, Chip, Grid, Paper, TextField, Tooltip, Typography } from "@mui/material";

// Project Resources
import { cTheme } from "../resources/Themes";
import { searchSort } from "../resources/SearchSort";
import { Drag, Bucket } from "../components/Drag";

// Other Resources
import { HTML5Backend } from 'react-dnd-html5-backend'


/*
This is the most important component of all of AgendaRaven.
It's where all the magic happens. As a result, much of the 
time working on the program should be spent here. This is 
the main selling point of the program, and its success and 
user-friendliness is vital to the success of the program.
*/
function MenuIcon(props) {
    return (
        <Tooltip title={props.title}>
            <Button 
            variant={props.selected ? "text" : "contained" }
            disableElevation
            onClick={props.handleClick}
            sx={{
                textTransform: 'none', 
                borderRadius: 0, 
                height: '100%',
                width: props.width
            }}
            >
                <Box minWidth='64px'>
                    {props.children}
                    <Typography sx={{fontSize: '12px'}} margin={0}>
                        {props.title}
                    </Typography>
                </Box>
            </Button>
        </Tooltip>
    )
}

function Top(props) {
    const [ title, setTitle ] = useState('Untitled-1');
    const [ type, setType ] = useState();

    return (
        <Box>
            <Paper 
            square
            elevation={0}
            sx={{
                margin: 0,
                width: '100%', 
                height: 64,
                display: "flex",
                flexDirection: 'row',
            }}
            >
                <Box 
                flex={1} 
                height='100%' 
                sx={{display: 'flex',
                    alignItems: 'center'}}
                >
                    <TextField
                    name="Schedule Name"
                    placeholder="Schedule Name"
                    variant="standard"
                    value={title}
                    onClick={e => {
                        e.target.focus();
                        e.target.select();
                        }}
                    onChange={e => {setTitle(e.target.value)}}                      
                    sx={{width: '300px', margin: 1, mb: 0 }}
                    inputProps={{
                        style: {
                            fontSize: '25px'
                        },
                        }}
                    />
                    <TextField
                    name="Type"
                    placeholder="Schedule Type"
                    variant="standard"
                    sx={{width: '200px', margin: 1, mb: 0 }}
                    inputProps={{
                        style: {
                            fontSize: '25px'
                        },
                        }}
                    />
                </Box>
                <Box 
                flex={0} 
                display='flex' 
                flexDirection={'row'}
                >
                    <Chip label="Not Saved" sx={{margin: 'auto'}} color={'error'} />
                    <MenuIcon title="Undo">
                        <Undo />
                    </MenuIcon>
                    <MenuIcon title="Redo">
                        <Redo />
                    </MenuIcon>
                    <MenuIcon title="Save">
                        <Save />
                    </MenuIcon>
                    <MenuIcon title="Download">
                        <Download/> 
                    </MenuIcon>
                </Box>
            </Paper>
        </Box>
    )
}

function Palette(props) {
    const theme = useTheme();
    const [ value, setValue ] = useState('');
    const peopleItems = ['Let', 'it', 'snow'];
    const fieldItems = ['Time', 'Place', 'Day']
    const dragItems =  props.palette === 'people' ? peopleItems : fieldItems
    return (
        <Box 
        borderLeft={`2px solid ${theme.palette.primary.main}`}
        flex={0}
        >
            <Box sx={{width: '270px'}} height={'calc(100% - 54px)'}>
                <TextField 
                sx={{width: '100%'}}
                variant='filled'
                value={value}
                placeholder={'Search'}
                onChange={(e) => {setValue(e.target.value)}}
                />
                <Box padding={1}>
                    
                    <Grid container padding={1} spacing={1} width={'100%'}>
                        {searchSort(value, dragItems).map(item => (
                            <Drag 
                            key={item} 
                            id={item} 
                            type={props.palette}
                            deps={[props.fields]}
                            >
                                {item}
                            </Drag>
                        ))}
                    </Grid>

                </Box>
            </Box>
            <Bottom>
                <MenuIcon 
                title="Fields" 
                width={'54px'} 
                handleClick={() => {props.setPalette('fields')}} 
                selected={props.palette === 'fields'}
                >
                    <GridOn />
                </MenuIcon>
                <MenuIcon 
                title="People" 
                width={'54px'} 
                handleClick={() => {props.setPalette('people')}} 
                selected={props.palette === 'people'}
                >
                    <Group />
                </MenuIcon>
            </Bottom>
        </Box>
    )
}

function DeleteBucket(props) {
    function handleDrop(item, monitor) {
        let fields = [...props.fields]
        const i = fields.indexOf(item.id);
        if (i !== -1) {
            fields.splice(i, 1)
        }
        props.setFields(fields)
    }
    return (
        <Bucket
        accept={['moving']}
        drop={handleDrop}
        deps={[props.fields]}
        >
            <Delete sx={{my: 2, mx: 7}} />
        </Bucket>
    )
}

function FieldBucket(props) {
    function handleDrop (item, monitor) {
        if (props.fields[0]) {
            let add = item.id;
            for (let i = 2; props.fields.includes(add); i++) {
                add = item.id + ' ' + i;
            }
            let fields = [...props.fields]
            fields.splice(props.index, 0, add)
            props.setFields(fields)
        } else {
            props.setFields([item.id])
        }
    }

    return (
      <Bucket
      accept={'fields'}
      drop={handleDrop}
      deps={[props.fields]}
      outlined={props.outlined}
      ariaRole={'Field Bucket'}
      >
        <Drag
        type={'moving'}
        id={props.item}
        deps={[props.fields]}
        >
            {
            props.item 
            ?
            props.item
            :
            props.children
            }
        </Drag>
      </Bucket>
    )
}

// Format of fields:
// {List} with no duplicates

function Schedule(props) {
    return (
        <Box flex={1} >
            <Box height={'calc(100% - 54px)'} width={'100%'} >
                {props.fields[0]
                ?
                <Box display={'flex'} flexDirection={'row'} height={'100%'}>
                    {props.fields.map((field, index) => (
                        <Box flex={1} key={index} height={'100%'}>
                            <FieldBucket 
                            item={field}
                            fields={props.fields} 
                            setFields={props.setFields} 
                            index={index}
                            outlined
                            />
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
                }
                
            </Box>
            <Bottom 
            right={
                <DeleteBucket fields={props.fields} setFields={props.setFields} />
            }
            >
                <Box display={'flex'} >
                    <MenuIcon title="Availability" flex={1}>
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

function Bottom(props) {
    const theme = useTheme();
    return (
        <Box 
        display={'flex'}
        flexDirection='row'
        sx={{ height: '54px' }}
        >
            <Box 
            flex={0}
            display={'flex'}
            flexDirection={'row'}
            >
                {props.children}
            </Box>
            <Box
            sx={{
                backgroundColor: theme.palette.primary.main, 
                flexGrow: 1
            }}
            elevation={0}
            >
                <Box sx={{float: 'right'}}>
                    {props.right}
                </Box>
            </Box>
        </Box>
    )
}

/**
 * ## The Soar Scheduling Component
 * 
 * @param  {Map} props
 */
export default function Soar(props) {
    const [ palette, setPalette ] = useState('fields')
    const [ fields, setFields ] = useState([])
    const [ items, setItems ] = useState({})

    return (
        <ThemeProvider theme={cTheme}>  
            <DndProvider backend={HTML5Backend}>
                <Box minWidth={915} width='100%' margin={0} height={'calc(100% - 64px)'} position={'fixed'} top='0px' left='0px'>
                    <Top />
                    <Box display={'flex'} flexDirection='row' height={'100%'}>
                        <Schedule 
                        palette={palette} 
                        setPalette={setPalette} 
                        fields={fields}
                        setFields={setFields}
                        />
                        <Palette palette={palette} setPalette={setPalette} />
                    </Box>
                </Box> 
            </DndProvider>
        </ThemeProvider>
    )
}