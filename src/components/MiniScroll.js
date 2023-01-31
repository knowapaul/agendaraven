import { Box } from "@mui/system"
export default function MiniScroll(props) {
    return (
        <Box height={'90%'} sx={{overflow: {xs: 'none', sm: 'auto'}}}>
            {props.children}
        </Box>
    )
}