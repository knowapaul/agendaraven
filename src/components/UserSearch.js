// React Resources
import { useEffect, useState } from "react"

// MUI Resources
import { Box, Typography, TextField, Avatar, Grid, Button } from "@mui/material"
import { useTheme } from "@emotion/react"

// Project Resources
import { getPeople } from "../resources/Firebase";
import { searchSort } from '../resources/SearchSort'


/**
 * @param  {map} props
 * 
 * Requires:
 * props.firebase
 * props.org
 * props.selected
 * props.setSelected
 * props.button
 */
export default function UserSearch(props) {
    const theme = useTheme();
    const [ value, setValue ] = useState('');
    const [ people, setPeople] = useState({});

    useEffect(() => {
        getPeople(props.org, setPeople)
    }, [])

    // const options = ['tail angle', 'tail proud', 'angle proud', 'angle upset', 'proud upset', 'proud topple', 'upset topple', 'upset gas', 'topple gas', 'topple floor', 'gas floor', 'gas he', 'floor he', 'floor vote', 'he vote', 'he canvas', 'vote canvas', 'vote lid', 'canvas lid', 'canvas scrape', 'lid scrape', 'lid misplace', 'scrape misplace', 'scrape feminine', 'misplace feminine', 'misplace tidy', 'feminine tidy', 'feminine test', 'tidy test', 'tidy capture', 'test capture', 'test ban', 'capture ban', 'capture resolution', 'ban resolution', 'ban float', 'resolution float', 'resolution cold', 'float cold', 'float infrastructure', 'cold infrastructure', 'cold expression', 'infrastructure expression', 'infrastructure hole', 'expression hole', 'expression offspring', 'hole offspring', 'hole insistence', 'offspring insistence', 'offspring wilderness', 'insistence wilderness', 'insistence regulation', 'wilderness regulation', 'wilderness excess', 'regulation excess', 'regulation petty', 'excess petty', 'excess orange', 'petty orange', 'petty rich', 'orange rich', 'orange demand', 'rich demand', 'rich constituency', 'demand constituency', 'demand majority', 'constituency majority', 'constituency sting', 'majority sting', 'majority thirsty', 'sting thirsty', 'sting mainstream', 'thirsty mainstream', 'thirsty misery', 'mainstream misery', 'mainstream scream', 'misery scream', 'misery content', 'scream content', 'scream parallel', 'content parallel', 'content riot', 'parallel riot', 'parallel prosper', 'riot prosper', 'riot glance', 'prosper glance', 'prosper credibility', 'glance credibility', 'glance truth', 'credibility truth', 'credibility ambition', 'truth ambition', 'truth broccoli', 'ambition broccoli', 'ambition allow', 'broccoli allow', 'broccoli undefined', 'flu punish', 'punish outlet', 'outlet mayor', 'mayor west', 'west abridge', 'abridge vegetation', 'vegetation conference', 'conference citizen', 'citizen module', 'module investigation', 'investigation hilarious', 'hilarious worry', 'worry thoughtful', 'thoughtful preparation', 'preparation diagram', 'diagram frog', 'frog agreement', 'agreement factory', 'factory feed', 'feed country', 'country feast', 'feast publicity', 'publicity jewel', 'jewel pace', 'pace north', 'north picture', 'picture consider', 'consider shape', 'shape copy']
    return (
        <Box>
            <Box sx={{padding: 2, display: 'flex'}}>
                <TextField
                label='Search Users'
                variant="outlined"
                value={value}
                onChange={(event) => {setValue(event.target.value)}}
                sx={{ flex: 3, input: { color: theme.palette.text.secondary }}}
                />
                {props.button}
            </Box>
            
            <Grid container spacing={1} padding={2} maxHeight={'calc(100vh - 64px - 88px)'} overflow="scroll">
                {searchSort(value, Object.keys(people)).map((key) => {
                    function handleSelect() {
                        const person = {[key]: people[key]}
                        const newSelected = Object.assign({}, person, props.selected)
                        if (Object.keys(props.selected).includes(key)) {
                            if (props.multiple) {
                                let clone = Object.assign({}, props.selected)
                                delete clone[key]
                                props.setSelected(clone)
                            }
                        } else {
                            props.setSelected(props.multiple ? newSelected : person)
                        }
            
                    }
                    ;
                    return (
                    <Grid item xs={6} sm={6} md={4} lg={3} height='110px' key={key}>
                        <Button 
                        variant={Object.keys(props.selected).includes(key) ? "contained" : 'outlined'}
                        sx={{width: '100%', height: '100%', textTransform: 'none'}}
                        onClick={handleSelect}
                        >
                            <Box>
                                <Avatar sx={{margin: 'auto'}}>{key[0].toUpperCase()}</Avatar>
                                <Typography 
                                variant='body1'
                                textAlign={'center'}
                                >
                                    {key.split(' ')[0][0].toUpperCase() + key.split(' ')[0].slice(1).toLowerCase()}
                                </Typography>
                                <Typography 
                                variant='body2'
                                textAlign={'center'}
                                >
                                    {key.toUpperCase().split(' ')[1]}
                                </Typography>
                            </Box>
                        </Button>
                    </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}