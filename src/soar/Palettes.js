// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { useTheme } from "@emotion/react";
import { GridOn, Group, OtherHouses } from "@mui/icons-material";
import { Box, Button, Grid, Paper, Switch, TextField, Tooltip, Typography } from "@mui/material";

// Project Resources
import { Drag } from "../components/Drag";
import { searchSort } from "../resources/SearchSort";


// Other Resources
import { Stack } from "@mui/system";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { getPeople } from "../resources/Firebase";


function ItemsPalette(props) {
    const theme = useTheme();
    const [ people, setPeople] = useState({});

    useEffect(() => {
        getPeople(props.org, setPeople)
    }, [])


    return (
        <Grid container padding={2} width={'270px'} sx={{margin: 0, padding: 0}}>
            {searchSort(props.value, Object.keys(people)).map((key) => {
                const firstName = key.split(' ')[0][0].toUpperCase() + key.split(' ')[0].slice(1).toLowerCase();
                return (
                    <Grid key={key}  item sx={{margin: 1}}>
                        <Drag type="person" id={people[key].schedulename} >
                            <Typography 
                            variant='body1'
                            >
                                {firstName}
                            </Typography>
                            <Typography 
                            variant='body2'
                            >
                                {key.toUpperCase().split(' ')[1]}
                            </Typography>
                        </Drag>
                    </Grid>
                )
            })}
        </Grid>
    )
}

function OtherPalette(props) {
    const [ on, setOn ] = useState(false);

    return (
        <Box padding={1}>
            <Typography>
                {on ? 'Value' : 'Field'}
                </Typography>
                <Switch 
                value={on}
                onChange={() => {setOn(!on)}}
                />
            <Drag 
            id={props.value} 
            type={on ? 'person' : 'fields'}
            deps={[props.value, on]}
            >
                <Paper>
                    <Typography  sx={{padding: 1}}>
                        {props.value}
                    </Typography>
                </Paper>
            </Drag>
        </Box>
    )
}

function FieldsPalette(props) {
    return (
        <Box padding={1}>
            <Grid container padding={1} spacing={1} width={'100%'}>
                {searchSort(props.value, props.dragItems).map(item => (
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
    )
}

function Tab(props) {

}

function Tabs(props) {
    const options = {
        Fields: <GridOn />,
        People: <Group />,
        Other: <OtherHouses />,
    }

    return (
        <Stack direction='row' spacing={'2px'}>
            {
                Object.entries(options).map((opt) => (
                        <Button
                        key={opt[0]}
                        variant="contained"
                        sx={{ padding: .5, borderTopLeftRadius: 0, borderTopRightRadius: 0}}
                        width={'100%'} 
                        onClick={() => {props.setPalette(opt[0].toLowerCase()); props.setValue('')}} 
                        selected={props.palette === opt[0].toLowerCase()}
                        >
                            <Tooltip title={opt[0]}>
                                <Stack direction={'row'}>
                                    {opt[1]}
                                    <Typography variant="subtitle2">
                                        {opt[0]}
                                    </Typography>
                                </Stack>
                            </Tooltip>
                        </Button>
                ))
            }
        </Stack>
    )
}

export function Palette(props) {
    const theme = useTheme();
    const [ value, setValue ] = useState('');
    
    const fieldItems = ['Time', 'Place', 'Day'];

    const palettes = {
        people: <ItemsPalette org={props.org} firebase={props.firebase} value={value} />,
        fields: <FieldsPalette value={value} dragItems={fieldItems} palette={props.palette} fields={props.fields}/>,
        other: <OtherPalette value={value} />
    }
    // const dragItems =  props.palette === 'people' ? peopleItems : fieldItems
    return (
        <Box 
        borderLeft={`2px solid ${theme.palette.primary.main}`}
        flex={0}
        >
            <Box sx={{width: '270px'}} height={'calc(100% - 54px)'}>
                <ErrorBoundary>
                    <TextField 
                    sx={{width: '100%', mb: '1px'}}
                    variant='filled'
                    value={value}
                    placeholder={'Search'}
                    onChange={(e) => {setValue(e.target.value)}}
                    />
                                    <Tabs {...props} value={value} setValue={setValue} />

                    {palettes[props.palette]}
                </ErrorBoundary>
            </Box>
            
        </Box>
    )
}

// <Bottom>
//                 <MenuIcon 
//                 title="Fields" 
//                 width={'54px'} 
//                 handleClick={() => {props.setPalette('fields'); setValue('')}} 
//                 selected={props.palette === 'fields'}
//                 >
//                     <GridOn />
//                 </MenuIcon>
//                 <MenuIcon 
//                 title="People" 
//                 width={'54px'} 
//                 handleClick={() => {props.setPalette('people'); setValue('')}} 
//                 selected={props.palette === 'people'}
//                 >
//                     <Group />
//                 </MenuIcon>
//                 <MenuIcon 
//                 title="Other" 
//                 width={'54px'} 
//                 handleClick={() => {props.setPalette('other'); setValue('')}} 
//                 selected={props.palette === 'other'}
//                 >
//                     <OtherHouses />
//                 </MenuIcon>
//             </Bottom>