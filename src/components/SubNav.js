import { Box, Button, Paper, responsiveFontSizes, ThemeProvider, Tooltip, Typography } from "@mui/material";
import { uTheme } from "../resources/Themes";

/**
 * @param  {Map} props
 * 
 * - props.title -> the button tooltip text
 * - props.handleClick -> the button's action
 * - props.children -> the button's contents
 */
export function NavButton(props) {
    return (
        <Tooltip title={props.title}>
            <Button 
            disableElevation 
            variant="contained" 
            sx={{
                borderRadius: '0px',
                borderTopRightRadius: props.tab ? 6 : 0,
                borderTopLeftRadius: props.tab ? 6 : 0,
                height: '57.5px',
                boxShadow: 'none', 
                backgroundColor: props.bg,
                '&:hover': {
                    backgroundColor: props.hover,
                },
            }}
            onClick={props.handleClick}
            >
                {props.children}
            </Button>
        </Tooltip>
    )
}
/**
 * A consistent-looking navigation component
 * 
 * props.title -> the nav bar's title
 * props.left -> the components on the left side of the nav
 * props.right -> the components on the right side of the nav
 */
export function SubNav(props) {
    return (
        <ThemeProvider theme={responsiveFontSizes(uTheme)}>
            <Paper elevation={0} sx={{ display: 'flex', position: 'relative', borderRadius: '0px', height: '57.5px' }}>
                <Box sx={{float: 'left', position: 'absolute', top: 0, left: 0}}>
                    {props.left}
                </Box>
                <Typography 
                variant='h5' 
                noWrap 
                sx={{
                    margin: 'auto', 
                    color: uTheme.palette.text.secondary,
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                    {props.title}
                </Typography>
                <Box sx={{float: 'right', position: 'absolute', top: 0, right: 0}}>
                    {props.right}
                </Box>
            </Paper>
        </ThemeProvider>
    )
}