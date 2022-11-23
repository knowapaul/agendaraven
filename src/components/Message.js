import { useTheme } from "@emotion/react";
import { Paper, Box } from "@mui/material"

export default function Message(props) {
    const theme = useTheme();
    return (
        <Box sx={{display: 'flex', justifyContent: props.side, }}>
            <Paper sx={{
                margin: 1, 
                pt: .5, pb: .5, pl: 1, pr: 1, 
                borderRadius: 4, 
                backgroundColor: theme.palette.background.default, 
                maxWidth: '50%'}}>
                Message text
            </Paper>
        </Box>
    )
}