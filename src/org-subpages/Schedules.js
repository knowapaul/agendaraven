import { useState } from "react"
import Cards from "../components/Cards";
import { Edit, EventAvailable, Visibility } from '@mui/icons-material'
import { Icon, IconButton, Tooltip } from "@mui/material";
import { Form } from '../components/Form'




// Options for the View component
function Icons(props) {
    return (
        <div>
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
            <Tooltip title={"Edit Schedule"}>
                <IconButton color="secondary">
                    <Edit />
                </IconButton>
            </Tooltip>
        </div>
    )
}

// View posted schedules
function View(props) {
    const [ data, setData ] = useState([{title: 'Test', subtitle: 'Try 0', description: 'Description here'}]);


    return (
        <Cards 
        data={data} 
        helperMessage={'This means there is no data'} 
        icons={<Icons />} 
        form={'string'}
        add={{
            text: 'New Schedule',
            tooltip: 'Create a New Schedule',
        }}
        />
    )
}

// Main export
export default function Schedules(props) {
    return (
        <div>
            <View />
        </div>
    )
}