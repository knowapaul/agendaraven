// React Resources
import { useState } from "react"

// MUI Resources
import { AddBusiness, Edit, EventAvailable, Visibility } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from "@mui/material";

// Project Resources
import Cards from "../components/Cards";
import AddButton from "../components/AddButton";
import AdminCheck from "../components/AdminCheck";


// Options for the View component
function Icons(props) {
    return (
        <Box display={'flex'} flexDirection={'row'}>
            <Tooltip title={"View Schedule"}>
                <IconButton color="secondary">
                    <Visibility />
                </IconButton>
            </Tooltip>
            <Tooltip title={"My Availability"}>
                <IconButton color="secondary">
                    <EventAvailable />
                </IconButton>
            </Tooltip>
            <AdminCheck org={props.org}>
                <Tooltip title={"Edit Schedule"}>
                    <IconButton color="secondary">
                        <Edit />
                    </IconButton>
                </Tooltip>
            </AdminCheck>
        </Box>
    )
}

// View posted schedules
function View(props) {
    const [ data, setData ] = useState([{title: 'Test', subtitle: 'Try 0', description: 'Description here'}]);

    return (
        <Cards 
        data={data} 
        helperMessage={'This means there is no data'} 
        icons={<Icons org={props.org} />} 
        add={
            <AdminCheck org={props.org} >
                <AddButton 
                text='New Schedule'
                tooltip='Open the Schedule Creator'
                url='/soar'
                />
            </AdminCheck>
        }
        />
    )
}

// Main export
export default function Schedules(props) {
    return (
        <div>
            <View org={props.org} />
        </div>
    )
}