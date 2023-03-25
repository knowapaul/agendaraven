// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { Backdrop, Box, CircularProgress, Stack, Typography } from "@mui/material";

// Project Resources
import { mTheme, uTheme } from "../resources/Themes";


// export function MiniLoad(props) {
//     return (
//         <Box
//         display='flex'
//         justifyContent={'center'}
//         alignContent={'center'}
//         >
//             <Stack >
//                 <Typography
//                 textAlign={'center'}
//                 mt={5}
//                 mb={3}
//                 >
//                     {
//                     props.text 
//                     ? 
//                     props.text
//                     :
//                     'Loading...'
//                     }
//                 </Typography>
//                 <Box
//                 display='flex'
//                 justifyContent={'center'}
//                 alignContent={'center'}
                
//                 >
//                     <CircularProgress color="secondary" />
//                 </Box>
//             </Stack>
//         </Box>
//     )
// }

/**
 * 
 * props.text - the text to display on the loading screen
 * @returns 
 */
export function MiniLoad(props) {
    return (
        <Box
        display='flex'
        justifyContent={'center'}
        alignContent={'center'}
        >
            <Stack >
                <Typography
                textAlign={'center'}
                mt={5}
                mb={3}
                color={uTheme.palette.text.primary}
                >
                    {
                    props.text 
                    ? 
                    props.text
                    :
                    'Loading...'
                    }
                </Typography>
                <Box
                display='flex'
                justifyContent={'center'}
                alignContent={'center'}
                
                >
                    <CircularProgress color="secondary" />
                </Box>
            </Stack>
        </Box>
    )
}

export default function Loading(props) {
    // ? Maybe don't open immediately ?
    // const [ quick, setQuick ] = useState(false);

    // setTimeout(() => {setQuick(false)}, 500);

    return (
        <div>
            <ThemeProvider theme={mTheme}>
                <Backdrop open={props.state} sx={{transition: 'none', zIndex: 1300, position: 'absolute', top: 0, left: 0, backgroundColor: props.dark ? uTheme.palette.primary.main : undefined }}>
                    <MiniLoad text={props.text} />
                </Backdrop>
            </ThemeProvider>
            {
                props.state 
                ?
                ''
                :
                props.children
            }
        </div>
    )
}