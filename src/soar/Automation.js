import { Add, Close, Delete, DeleteForever, Menu as MenuIcon, ShapeLine, TextFormat } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, ClickAwayListener, IconButton, Menu, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { Box, ThemeProvider } from "@mui/system";
import { useState } from "react";
import { uTheme } from "../resources/Themes";

function CodeEditor(props) {
    // const [ code, setCode ] = useState([]);
    let nums = [];
    for (let i = 0; i < 101; i++) {
        nums = nums.concat(String(i))
    }

    const ops = {
        'ADD': ['Number', 'Number'],
        'SUBTRACT': ['Number', 'Negative'],
        'MULTIPLY': ['Number', 'Number'],
        'DIVIDE': ['Numerator', 'Denominator'],
        'EXP': ['Base', 'Power'],
        'SQRT': ['Number'],
        'COUNT': ['Item', 'List'],
        'GREATER': ['Number', 'Number'],
    }

    const values = [
        'ans',
        'outputIndex',
        'itemIndex',
        'items',
        'outputs',
        'context',
        'lineIndex',
        'outputLine',
        ...nums
    ]

    const handleChange = (index) => (event) => {
        if (ops[event.target.value]) {
            const line = [event.target.value].concat([null, null, null].slice(0, ops[event.target.value].length))
            let temp = {...props.funcs}
            temp[props.name][index] = line
            props.setFuncs(temp)
        }
    }   

    const handleParamChange = (index, item) => (event, value) => {
        let temp = {...props.funcs};
        temp[props.name][index][item] = value;
        props.setFuncs(temp);
    }

    const handleAdd = () => {
        let temp = {...props.funcs}
        temp[props.name] = temp[props.name].concat([[null]])
        props.setFuncs(temp)
    }

    const handleDeleteLine = (index) => () => {
        let temp = {...props.funcs}
        temp[props.name][index] = temp[props.name].splice(index, 1)
        props.setFuncs(temp)
    }

    return (
        <Paper variant='outlined' sx={{margin: 1}}>
            {props.funcs[props.name].map((line, index) => {
                const [_op, ...fields] = line
                console.log('Use this for something', _op)
                return (
                    <Stack 
                    key={index} 
                    direction={'row'} 
                    width={'100%'} 
                    display='flex' 
                    onClick={() => {props.setIsDeleting(false); console.log('clicked!')}}
                    >
                        <IconButton 
                        onClick={handleDeleteLine(index)}  
                        sx={{
                            display: props.isDeleting ? 'initial' : 'none', 
                            height: '40px', 
                            width: '40px', 
                            my: 'auto', 
                            mx: 1
                        }}
                        >
                            <Close />
                        </IconButton>
                        <Autocomplete
                        key={index}
                        sx={{margin: 1, width: '100%'}}
                        disablePortal
                        clearIcon={''}
                        id="Function"
                        options={Object.keys(ops)}
                        flex={1}
                        disabled={props.isDeleting} 
                        autoHighlight
                        autoSelect
                        value={props.funcs[props.name][index][0] || null}
                        onSelect={handleChange(index)}
                        renderInput={(params) => 
                            <TextField 
                            variant='standard' 
                            {...params} 
                            label="Operation" 
                            />
                        }
                        />
                        {
                            fields.map((field, item) => (
                                <Autocomplete
                                key={item}
                                sx={{margin: 1, width: '100%'}}
                                disablePortal
                                autoHighlight
                                autoSelect
                                clearIcon={''}
                                disabled={props.isDeleting} 
                                id="Function"
                                onClick={() => {props.setIsDeleting(false)}}
                                value={props.funcs[props.name][index][item + 1] || null}
                                onChange={handleParamChange(index, item + 1)}
                                flex={1}
                                options={values}
                                renderInput={(params) => 
                                    <TextField 
                                    variant='standard' 
                                    {...params} 
                                    label={ops[props.funcs[props.name][index][0]][item]} 
                                    />
                                }
                                />
                            ))
                        }
                    </Stack>
                )
            })}
            <Button 
            onClick={handleAdd} 
            sx={{width: '100%'}}
            >
                <Add color={'secondary'} />
                <Typography sx={{ml: 1}}>
                    Add a line
                </Typography>
            </Button>
        </Paper>
    )
}

function FunctionCard(props) {
    const [ expanded, setExpanded ] = useState(false);
    const [ anchorElUser, setAnchorElUser ] = useState(null);
    const [ isRenaming, setIsRenaming ] = useState(props.funcs[props.name] === '__NEW__');
    const [ tempName, setTempName ] = useState(props.name);
    const [ isDeleting, setIsDeleting ] = useState(false);

    const handleOpenUserMenu = (event, user) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleClickAway = () => {
        setIsRenaming(false)
        let temp = {...props.funcs}
        if (temp[props.name] === '__NEW__') {
            temp[props.name] = []
        }
        if ((tempName !== props.name) && tempName && temp[tempName] === undefined) {
            temp[tempName] =  temp[props.name]
            delete temp[props.name]
        } else {
            setTempName(props.name)
        }
        props.setFuncs(temp)
    }

    const handleDeleteFunction = () => {
        let temp = {...props.funcs}
        delete temp[props.name]
        props.setFuncs(temp)
    }

    // Name, icon, action
    const menuItems = [
        ['Rename', <TextFormat />, () => {setIsRenaming(true)}],
        ['Remove Lines', <Delete />, () => {setIsDeleting(!isDeleting); console.log('clicked')}],
        ['Delete Function', <DeleteForever />, handleDeleteFunction],
    ]

    return (
        <ClickAwayListener onClickAway={() => {setIsDeleting(false)}}>
            <Accordion 
            expanded={expanded} 
            elevation={0} 
            sx={{
                backgroundColor: uTheme.palette.background.default, 
                border: `1px solid ${uTheme.palette.grey['900']}`
                }}
            >
                <AccordionSummary
                key={'top'}
                sx={{px: 2, margin: 0, }}
                >
                    <Box display='flex' flexDirection={'row'} width='100%'>
                        {
                            isRenaming ?
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <TextField
                                focused={isRenaming}
                                onFocus={(event) => {
                                    event.target.select()
                                }}
                                variant="standard"
                                value={tempName}
                                onChange={(e) => {setTempName(e.target.value)}}
                                sx={{ 
                                    flex: 1, 
                                    input: { 
                                        fontSize: '20px', 
                                        pt: '1px' 
                                    }
                                }} 
                                />
                            </ClickAwayListener>
                            :
                            <Typography
                            variant="h6"
                            onClick={() => {setExpanded(!expanded)}}
                            sx={{margin: 0, color: '#001f3d', flex: 1}}
                            >
                                {props.name}
                            </Typography>
                        }
                        <IconButton flex={0} onClick={handleOpenUserMenu} >
                            <MenuIcon sx={{color: '#001f3d'}}/>
                        </IconButton>
                        <Menu
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        onClick={handleCloseUserMenu}
                        >
                            {menuItems.map((item) => (
                                <MenuItem key={item} onClick={item[2]}>
                                    {item[1]}<Typography sx={{ml: 1}}>{item[0]}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{padding: 0}} key={'bottom'}>
                        {
                            props.funcs[props.name] === '__NEW__'
                            ?
                            ''
                            :
                            <CodeEditor isDeleting={isDeleting} setIsDeleting={setIsDeleting} {...props} />
                        }
                </AccordionDetails>
            </Accordion>
        </ClickAwayListener>
    )
}

function Prebuilts(props) {
    const [ prebuilts ] = useState({function5: 'code1'})
    // setPreBuilts
    // TODO: Pick up where you left off:
    // TODO: FINISH AUTOCOMPLETE CAPABILITY
    return (
        <div>
            <Autocomplete
            sx={{margin: 1}}
            disablePortal
            id="Function"
            options={[]}
            renderInput={(params) => 
                <TextField 
                variant='standard' 
                {...params} 
                label="Search for a function" 
                />
            }
            />
            {
                Object.entries(prebuilts).map((func) => (
                    <Paper key={func[0]} sx={{margin: 1, padding: 1}}>
                        {func[0]}
                    </Paper>
                ))
            }
        </div>
    )
}

function LeftPane(props) {
    const boxWidth = '250px'

    return (
        <div>
            <Box display={{xs: 'none', sm: 'initial'}} >
                <Box width={boxWidth} />
                <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    position: 'fixed', 
                    width: boxWidth, 
                    top: 64, 
                    left: 250,
                    height: '100vh'
                }} 
                borderRight={`1px solid ${uTheme.palette.primary.main}`}
                >
                    <Box width={'100%'} flex={3}>
                        <Typography variant="h6" sx={{margin: 1, borderBottom: `1px solid ${uTheme.palette.primary.main}`}}>
                            Available Data
                        </Typography>
                    </Box>
                    <Box width={'100%'} flex={5}>
                        <Typography variant="h6" sx={{margin: 1, borderBottom: `1px solid ${uTheme.palette.primary.main}`}}>
                            Prebuilt Functions
                        </Typography>
                        <Prebuilts />
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

function RightPane(props) {
    const addFunc = () => {
        let temp = {...props.funcs};
        let attempt;
        for (let i = 1; i < 1000; i++) {
            attempt = 'Untitled-' + i;
            if (temp[attempt] === undefined) {
                break;
            }
        }
        temp[attempt] = '__NEW__';
        props.setFuncs(temp);
    }

    return (
        <Box sx={{flex: 2, padding: 2}} >
            {
                Object.entries(props.funcs).map((func) => (
                    <FunctionCard key={func[0]} name={func[0]} {...props}/>
                ))
            }
            <Button 
            sx={{width: '100%', mt: 1, backgroundColor: '#001f3d'}} 
            onClick={addFunc} 
            variant='contained'
            >
                <ShapeLine color={'secondary'} />
                <Typography sx={{ml: 2}}>
                    Add a function
                </Typography>
            </Button>
        </Box>
    )
}

export default function Automation(props) {
    return (
        <ThemeProvider theme={uTheme}>
            <Box height={'100%'} display='flex' flexDirection={'row'} width='100%'>
                <LeftPane />
                <RightPane {...props} />
            </Box>
        </ThemeProvider>

    )
}