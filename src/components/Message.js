import { useTheme } from "@emotion/react";
import { Paper, Box } from "@mui/material"

export default function Message(props) {
    const theme = useTheme();

    const b = props.side === 'right'
    const l = b ? '' : 0
    const r = b ? 0 : ''

    return (
        <Box sx={{display: 'flex', justifyContent: props.side, }}>
            <Paper 
            variant="outlined"
            className="chatMessage"
            elevation={3} 
            sx={{
                margin: 1, 
                pt: .5, pb: .5, pl: 1.5, pr: 1.5, 
                borderRadius: 4,
                borderBottomLeftRadius: l,

                borderBottomRightRadius: r,
                backgroundColor: theme.palette.background.default, 
                color: theme.palette.background.paper,
                borderStyle: 'solid',
                borderColor: theme.palette.background.paper,
                maxWidth: '50%',
                minHeight: '32px'
                }}>
                {props.body}
            </Paper>
        </Box>
    )
}