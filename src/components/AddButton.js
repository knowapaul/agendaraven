// MUI Resources
import { Add } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Project Resources
import PopupForm from "./PopupForm";
import { NavButton } from "./SubNav";


/**
 * @param  {Map} props React Props
 * 
 * - form = {JSX} The form to add a card 
 * - formTitle = {String} The form's title
 * - open = {Boolean} Form open state (REQUIRED)
 * - setOpen = {Function} Form setOpen function
 * - tooltip = {String} Tooltip of button
 * - text = {String} The button's text
 * - url? = {String} (instead of form) Link to another page instead of using a form
 */
export default function AddButton(props) {
    const navigate = useNavigate();
    const action = props.url ? () => {navigate(props.url)} : () => {props.setOpen(true)};
    return (
        <Box >
            <NavButton  
            title={props.tooltip}
            handleClick={action}
            >
                <Add sx={{mr: 1}} />
                <Typography
                noWrap
                >
                    {props.text}
                </Typography>
            </NavButton>

            <PopupForm open={props.open} setOpen={props.setOpen} title={props.formTitle} width={300}>
                {props.form}
            </PopupForm>
        </Box>
    )
}