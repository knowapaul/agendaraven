import { useTheme } from "@emotion/react";
import { Autocomplete, Paper, TextField, Typography } from "@mui/material";
import { Box, ThemeProvider } from "@mui/system";
import { useState } from "react";
import { uTheme } from "../resources/Themes";


function FunctionCard(props) {
    return (
        <Paper sx={{ margin: 2, padding: 2}}>
            <Typography variant="h6">
                {props.name}
            </Typography>
        </Paper>
    )
}

function Prebuilts(props) {
    const [ prebuilts, setPrebuilts ] = useState({function5: 'code1'})

    // TODO: Pick up where you left off:
    // TODO: FINISH AUTOCOMPLETE CAPABILITY
    return (
        <div>
            <Autocomplete
            sx={{margin: 1}}
            disablePortal
            id="Function"
            options={[]}
            renderInput={(params) => <TextField variant='standard' {...params} label="Search for a function" />}
            />
            {
                Object.entries(prebuilts).map((func) => (
                    <Paper key={func[0]} sx={{margin: 1, padding: 1}}>
                        asd
                        {func[0]}
                    </Paper>
                ))
            }
        </div>
    )
}

function LeftPane(props) {
    const theme = useTheme();

    return (
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}} borderRight={`2px solid ${theme.palette.primary.main}`}>
            <Box width={'100%'} flex={3}>
                <Typography variant="h6" sx={{margin: 1, borderBottom: `1px solid ${theme.palette.primary.main}`}}>
                    Available Data
                </Typography>
            </Box>
            <Box width={'100%'} flex={5}>
                <Typography variant="h6" sx={{margin: 1, borderBottom: `1px solid ${theme.palette.primary.main}`}}>
                    Prebuilt Functions
                </Typography>
                <Prebuilts />
            </Box>
        </Box>
    )
}

function RightPane(props) {
    return (
        <Box sx={{flex: 2}} >
            {
                Object.entries(props.funcs).map((func) => (
                    <Box key={func[0]}>
                        <FunctionCard name={func[0]} />
                    </Box>
                ))
            }
        </Box>
    )
}

export default function Automation(props) {
    const [ funcs, setFuncs ] = useState({function1: 'this is the code'});
    return (
        <ThemeProvider theme={uTheme}>
            <Box height={'100%'} display='flex' flexDirection={'row'} width='100%'>
                <LeftPane />
                <RightPane funcs={funcs} setFuncs={setFuncs} />
            </Box>
        </ThemeProvider>

    )
}