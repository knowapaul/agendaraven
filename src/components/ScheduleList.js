// MUI Resources
import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Check } from '@mui/icons-material'
import { useTheme } from "@emotion/react";


function ScheduleItem(props) {

    return (
        <div>
            <Check />
            <Typography variant="body">
                {props.title}
            </Typography>
        </div>
    )
}

export default function ScheduleList(props) {
    const theme = useTheme();

    return (
        <div>
            <Box sx={{borderBottom: 'solid', padding: 1, outlineColor: theme.palette.background.default}}>
                <Typography variant="h5">
                    Schedules
                </Typography>
            </Box>
            <Stack>

            </Stack>
        </div>
    )
}