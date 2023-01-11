// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { useTheme } from "@emotion/react";
import { GridOn, Group, OtherHouses } from "@mui/icons-material";
import { Box, Grid, Paper, Switch, TextField, Typography } from "@mui/material";

// Project Resources
import { searchSort } from "../resources/SearchSort";
import { Drag } from "../components/Drag";
import { MenuIcon } from './MenuIcon'
import { Bottom } from "./Headers";


// Other Resources
import { getPeople } from "../resources/Firebase";
import { ErrorBoundary } from "../components/ErrorBoundary";

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
                        <Drag type="person" id={key} >
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
                    sx={{width: '100%'}}
                    variant='filled'
                    value={value}
                    placeholder={'Search'}
                    onChange={(e) => {setValue(e.target.value)}}
                    />
                    {palettes[props.palette]}
                </ErrorBoundary>
            </Box>
            <Bottom>
                <MenuIcon 
                title="Fields" 
                width={'54px'} 
                handleClick={() => {props.setPalette('fields'); setValue('')}} 
                selected={props.palette === 'fields'}
                >
                    <GridOn />
                </MenuIcon>
                <MenuIcon 
                title="People" 
                width={'54px'} 
                handleClick={() => {props.setPalette('people'); setValue('')}} 
                selected={props.palette === 'people'}
                >
                    <Group />
                </MenuIcon>
                <MenuIcon 
                title="Other" 
                width={'54px'} 
                handleClick={() => {props.setPalette('other'); setValue('')}} 
                selected={props.palette === 'other'}
                >
                    <OtherHouses />
                </MenuIcon>
            </Bottom>
        </Box>
    )
}