import { BottomNavigation, Typography, Link, Stack, Divider } from "@mui/material";


export default function Footer() {
    return (
        <BottomNavigation sx={{mt: 3, padding: "1%"}}>
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
        </BottomNavigation>
    )
}