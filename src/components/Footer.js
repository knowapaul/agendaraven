// MUI Resources
import { BottomNavigation, Typography, Link, Stack, Divider, AppBar, Box, Paper } from "@mui/material";


export default function Footer() {
    return (
        <Paper
            square
            sx={{
                mt: 3, 
                padding: "1%", 
                width: '100%', 
                display: 'flex', 
                alignContent: 'center', 
                justifyContent: 'center'
                }}>
            <Stack direction="row" 
            spacing={2}
            divider={<Divider orientation="vertical" />}
            >
                <Typography
                fontFamily="Quicksand"
                >
                    AgendaRaven 2022
                </Typography>
                <Link
                fontFamily="Quicksand"
                >
                    Contact Us
                </Link>
            </Stack>
        </Paper>
    )
}