import { Paper, Box, Typography, TextField, Autocomplete, Avatar, useAutocomplete, Grid, Tooltip, Button, Fab, CircularProgress, Divider } from "@mui/material"
import { useTheme } from "@emotion/react"
import { useState } from "react"
import { boxSizing, Stack } from "@mui/system";
import { ArrowBack, Visibility } from "@mui/icons-material";
import { FbContext } from '../resources/Firebase'
import { getFirestore } from "firebase/firestore";
import { getRoles, getRolesDoc } from "../resources/HandleDb";
import PopupForm from "./PopupForm";
import AddIcon from '@mui/icons-material/Add'
import Form from "./Form";
import { httpsCallable } from "firebase/functions";
import { useDocument } from 'react-firebase-hooks/firestore';


/*
function ScoreCombo(noCaseInput, noCaseTarget) {
    // Use a convolution-like strategy to evaluate words' similarity
    const input = noCaseInput.toLowerCase();
    const target = noCaseTarget.toLowerCase();
    
    let score = 0;
    for (let char = 1; char < input.length - 1; char++) {
        score += target.slice(char - 1, char + 1).includes(input[char])
        score += (target[char] === input[char]) * .5
    }

    return score;
}*/

/*
function SortOptions(input, options) {
    const inputs = input.split(' ');
    let scores = {}
    for (let opt in options) {
        let optScores = {};

        // Use word-wise searches
        const words = options[opt].split(' ');
        for (let i in inputs) {
            for (let w in words) {
                optScores['a' + i + ',b' + w] = ScoreCombo(inputs[i], words[w]);
            }
        }
        const rankedScores = Object.keys(optScores).sort().sort((a, b) => optScores[a] - optScores[b]);

        let totalScore = 0;
        let avoid = [];
        for (let score in rankedScores) {
            const ids = score.split(',')
            let flag = false;
            for (let j in ids) {
                flag = flag || avoid.includes(ids[j]);
            }
            if (!flag) {
                totalScore += optScores[rankedScores[score]]
                avoid = avoid.concat(ids)
            }
        }
        if (totalScore > 0) {
            scores[options[opt]] = totalScore;
        }
    }

    const sorted = Object.keys(scores).sort().sort((a, b) => scores[b] - scores[a]);
    console.log(scores)

    return sorted;
}*/



function SortOptions(value, options) {
    let scoreMap = {};
    for (let i in options) {
        let phraseScore = {};
        const words = options[i].toLowerCase().split(' ');
        const inputs = value.toLowerCase().split(' ');
        for (let d = 0; d < words.length; d++) {
            for (let e = 0; e < inputs.length; e++) {
                let target = words[d];
                let current = inputs[e];
                let wordScore = 0;
                let consc = 0;
                for (let j = 0; j < current.length; j++) {
                    let cdif = target.indexOf(current.toLowerCase()[j])
                    if (cdif > 2) {cdif = -1}
                    if (cdif === 0) {
                        if (target === words[d]) {
                            consc++;
                        }
                        consc++;
                    } else {
                        consc -= cdif**4;
                        if (cdif === -1) {
                            consc -= 3;
                        }
                    }
                    if (!(cdif === -1)) {
                        wordScore -= consc**3;
                        target = target.slice(cdif + 1)
                    }
                }
                if (current.length > 2) {
                    wordScore += target.length
                }
                wordScore -= consc**3;
                
                // Change wordScore to a percentage
                const n = words[d].length;
                const maxScore = n**2 * (n+1)**2 / 4
                wordScore = wordScore/maxScore;

                // Phrasescore = {List}
                // = {keyword index: score}
                phraseScore[`a${d},b${e}`] = wordScore;
            }
            
        }
        const rank = Object.keys(phraseScore).sort().sort((a, b) => phraseScore[a] - phraseScore[b])
        let scores = phraseScore[rank[0]];
        let avoid = [];
        for (let i in rank) {
            const k = rank[i].split(',')
            let flag = false;
            for (let j in k) {
                if (avoid.includes(k[j])) {flag = true}
            }
            if (!flag) {
                scores += phraseScore[rank[i]];
                avoid = avoid.concat(k)
            }
        }
        // console.log(options[i], phraseScore)
        const total = scores;
        if (total <= 0) {
            scoreMap[options[i]] = total;
        }
    }
    return Object.keys(scoreMap).sort().sort((a, b) => scoreMap[a] - scoreMap[b])
}

function SearchUsers(props) {
    const theme = useTheme();
    const [ value, setValue ] = useState('');
    
    const options = ['tail angle', 'tail proud', 'angle proud', 'angle upset', 'proud upset', 'proud topple', 'upset topple', 'upset gas', 'topple gas', 'topple floor', 'gas floor', 'gas he', 'floor he', 'floor vote', 'he vote', 'he canvas', 'vote canvas', 'vote lid', 'canvas lid', 'canvas scrape', 'lid scrape', 'lid misplace', 'scrape misplace', 'scrape feminine', 'misplace feminine', 'misplace tidy', 'feminine tidy', 'feminine test', 'tidy test', 'tidy capture', 'test capture', 'test ban', 'capture ban', 'capture resolution', 'ban resolution', 'ban float', 'resolution float', 'resolution cold', 'float cold', 'float infrastructure', 'cold infrastructure', 'cold expression', 'infrastructure expression', 'infrastructure hole', 'expression hole', 'expression offspring', 'hole offspring', 'hole insistence', 'offspring insistence', 'offspring wilderness', 'insistence wilderness', 'insistence regulation', 'wilderness regulation', 'wilderness excess', 'regulation excess', 'regulation petty', 'excess petty', 'excess orange', 'petty orange', 'petty rich', 'orange rich', 'orange demand', 'rich demand', 'rich constituency', 'demand constituency', 'demand majority', 'constituency majority', 'constituency sting', 'majority sting', 'majority thirsty', 'sting thirsty', 'sting mainstream', 'thirsty mainstream', 'thirsty misery', 'mainstream misery', 'mainstream scream', 'misery scream', 'misery content', 'scream content', 'scream parallel', 'content parallel', 'content riot', 'parallel riot', 'parallel prosper', 'riot prosper', 'riot glance', 'prosper glance', 'prosper credibility', 'glance credibility', 'glance truth', 'credibility truth', 'credibility ambition', 'truth ambition', 'truth broccoli', 'ambition broccoli', 'ambition allow', 'broccoli allow', 'broccoli undefined', 'flu punish', 'punish outlet', 'outlet mayor', 'mayor west', 'west abridge', 'abridge vegetation', 'vegetation conference', 'conference citizen', 'citizen module', 'module investigation', 'investigation hilarious', 'hilarious worry', 'worry thoughtful', 'thoughtful preparation', 'preparation diagram', 'diagram frog', 'frog agreement', 'agreement factory', 'factory feed', 'feed country', 'country feast', 'feast publicity', 'publicity jewel', 'jewel pace', 'pace north', 'north picture', 'picture consider', 'consider shape', 'shape copy']
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
                <Button 
                variant="contained" 
                sx={{ ml: 2, flex: 1}}
                onClick={() => {props.setWidget('roles')}}
                >
                    <Visibility sx={{mr: 1}} />
                        Roles
                </Button>
            </Box>
            
            <Grid container spacing={1} padding={2} maxHeight={'calc(100vh - 64px - 88px)'} overflow="scroll">
                {SortOptions(value, options).map((opt) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} height='110px' key={opt}>
                        <Button 
                        variant={props.selected === opt ? "contained" : 'outlined'}
                        sx={{width: '100%', height: '100%', textTransform: 'none'}}
                        onClick={() => {props.setSelected(opt)}}
                        >
                            <Box>
                                <Avatar sx={{margin: 'auto'}}>{opt[0].toUpperCase()}</Avatar>
                                <Typography 
                                variant='body1'
                                textAlign={'center'}
                                >
                                    {opt.split(' ')[0][0].toUpperCase() + opt.split(' ')[0].slice(1).toLowerCase()}
                                </Typography>
                                <Typography 
                                variant='body2'
                                textAlign={'center'}
                                >
                                    {opt.toUpperCase().split(' ')[1]}
                                </Typography>
                            </Box>
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}


function User(props) {
    const nameText = props.selected.split(' ');
    const first = props.selected ? nameText[0][0].toUpperCase() + nameText[0].slice(1) : ''
    const last = props.selected ? nameText[1][0].toUpperCase() + nameText[1].slice(1) : ''
    return (
        <Paper width={10} sx={{m: 1, p: 2}}>
            <Stack direction='row' spacing={1}>
                <Avatar sx={{margin: 'auto', mx: 0}}/>
                <Box>
                    <Typography variant='body1' sx={{fontWeight: 'bold'}}>
                        {first}
                    </Typography>
                    <Typography variant='body1' sx={{fontWeight: 'bold'}}>
                        {last}
                    </Typography>
                </Box>
            </Stack>
            
        </Paper>
    )
}

function getRandomText() {
    const alphabet = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let out = ''
    for (let i = 0; i < 7; i++) {
        out += alphabet[Math.floor(Math.random()*36)]
    }
    out = out.slice(0, 3) + ' - ' + out.slice(3)
    return out;
}

function Add(props) {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState({});

    const key = getRandomText();

    // TODO: Extract this component

    return (
        <Box >
            <Button  
            variant="contained" 
            aria-label="add" 
            onClick={() => {setOpen(true)}}
            >
                <AddIcon sx={{mr: 1}} />
                <Typography
                noWrap
                >

                    Add Role
                </Typography>
            </Button>

            <PopupForm open={open} setOpen={setOpen} title={"Add Role"} width={300}>
                <Form 
                inputs={[
                    {title: 'Role Name',
                    type: 'text',
                    placeholder: '',
                    required: true,
                    validate: 'role'
                    },
                    {title: 'Role Description',
                    type: 'text',
                    placeholder: '',
                    required: true,
                    validate: 'none',
                    multiline: true,
                    }
                ]}
                data={data} 
                setData={setData} 
                buttonText={'Add'} 
                handleSubmit={() => {
                    props.addRole(
                        {
                        orgName: props.org,
                        roleName: data.rolename, 
                        roleKey: key, 
                        roleDescription: data.roledescription
                        }
                    ).then(
                        setOpen(false)
                    )
                }}
                >
                    <Typography>
                        {'Key: ' + key}
                    </Typography>
                </Form>
            </PopupForm>
        </Box>
    )
}

function Roles(props) {
    const db = props.firebase.db;
    const functions = props.firebase.functions;

    const [ rolesDoc, loading, error ]= useDocument(getRolesDoc(db, props.org));
    const addRole = httpsCallable(functions, 'addRole');
    const data = rolesDoc ? rolesDoc.data() : false;
    
    return (
        <div>
            <Box 
            sx={{display: 'flex', padding: 1}}
            >
                <Box flex={1}>
                    <Button 
                    onClick={() => {props.setWidget('users')}}
                    variant='contained'
                    >
                        <ArrowBack sx={{mr: 1}}/>
                        <Typography
                        noWrap
                        >
                            Back
                        </Typography>
                    </Button>
                </Box>
                <Box flex={0}>
                    <Add addRole={addRole} org={props.org} />
                </Box>
            </Box>
            {loading ? <CircularProgress />
            :
            <Grid container height={'calc(100vh - 64px - 52.5px)'} overflow='scroll' padding={1} spacing={2} sx={{mt: 0}}>
                {data ?
                Object.keys(data).map((key) => (
                    <Grid item 
                    xs={12} sm={12} md={6} lg={4} xl={3} 
                    width={'100%'} 
                    sx={{aspectRatio: '16 / 9'}}
                    >
                        <Paper 
                        variant="outlined"
                        sx={{
                            py: 1,
                            px: 2,
                            aspectRatio: '16 / 9',
                        }}
                        >
                            <Typography
                            variant='h6'
                            fontWeight={'bold'}
                            >
                                {key}
                            </Typography>
                            <Divider />
                            <Typography
                            variant='body2'
                            >
                                {'Join Code: ' + data[key].roleKey}
                            </Typography>
                            <Typography
                            variant='body1'
                            mt={1}
                            >
                                {data[key].roleDescription}
                            </Typography>
                        </Paper>
                    </Grid>
                ))
                :
                <Typography padding={4} textAlign={'center'}>
                    You currently have no roles in your organization. Click 'Add Role' to begin.
                </Typography>
            }
                
            </Grid>
            }
        </div>
    )
}

export default function People(props) {
    const [ widget, setWidget ] = useState('users')
    const [ selected, setSelected ] = useState('');
    
    return (
        <FbContext.Consumer>
            {firebase => (
                widget === 'roles' ? 
                <Roles org={props.org} firebase={firebase} setWidget={setWidget} />
                :
                widget === 'users' ? 
                <Box display={'flex'} flexDirection={'row'}>
                    <Box flex={2}>
                        <SearchUsers widget={widget} setWidget={setWidget} selected={selected} setSelected={setSelected} />
                    </Box>
                    <Box flex={1} width={10} sx={{display: { xs: 'none', md: 'block', }}}>
                        <User selected={selected} />
                    </Box>
                </Box> :
                <Stack>
                    <Box sx={{display: { sm: 'none', md: 'block' }}}>
                        <SearchUsers selected={selected} setSelected={setSelected} />
                    </Box>
                    <User selected={selected} />
                </Stack>
            )}
        </FbContext.Consumer>
    )
}