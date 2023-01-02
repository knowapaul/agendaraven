// MUI Resources
import { Accessibility, Clear, EventAvailable, ImportantDevices, Notifications } from "@mui/icons-material";
import { Box, Grid, Icon, IconButton, Stack, Typography } from "@mui/material";

// Project Resources
import { MenuIcon } from './MenuIcon'

// Other Resources
import { DeleteBucket, PersonBucket, FieldBucket } from './Buckets'
import { Bottom } from './Headers'


// Format of fields:
// {List} with no duplicates
export function Schedule(props) {
    const handleDelete = (index, field) => {
        let adapted = [...props.people];
        delete adapted[index][field];
        props.setPeople(adapted)
        console.log(props.people)
    }
    return (
        <Box flex={1} >
            <Box height={'calc(100% - 54px)'} width={'100%'} >
                {props.fields[0]
                ?
                <Box container display={'flex'} flexDirection={'row'} height={'100%'} ml='20px'>
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
                                        <Box item key={iIndex} minHeight={'50px'} sx={{border: '1px solid black', margin: 1}}>
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
                                            people={props.people} 
                                            setPeople={props.setPeople} 
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
                                    key={props.people.length} 
                                    index={props.people.length}
                                    parent={field}
                                    item={props.items[props.people.length]}
                                    people={props.people} 
                                    setPeople={props.setPeople} 
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