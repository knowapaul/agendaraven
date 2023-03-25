// MUI Resources
import { Divider, Link, Paper, Stack, Typography } from "@mui/material";


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
                className='quicksand'
                >
                    AgendaRaven 2022
                </Typography>
                <Link
                className='quicksand'
                >
                    Contact Us
                </Link>
            </Stack>
        </Paper>
    )
}