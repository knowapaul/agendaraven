// MUI Resources
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";


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
        <Paper elevation={0} sx={{ display: 'flex', borderRadius: '0px', height: '57.5px'}}>
            <Box sx={{flexGrow: 1}}>
                {props.left}
            </Box>
            <Typography variant='h5' noWrap sx={{margin: 'auto', flexGrow: 1}}>
                {props.title}
            </Typography>
            <Box sx={{flex: 0}}>
                {props.right}
            </Box>
        </Paper>
    )
}