// React Resources
import { useEffect, useState } from "react"

// MUI Resources
import { AddBusiness, Edit, EventAvailable, Visibility } from '@mui/icons-material'
import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";

// Project Resources
import Cards from "../components/Cards";
import AddButton from "../components/AddButton";
import AdminCheck from "../components/AdminCheck";
import { getAllSchedules } from "../resources/HandleDb";
import { FbContext } from "../resources/Firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";


// Options for the View component
function Icons(props) {
    const navigate = useNavigate();
    return (
        <Box display={'flex'} flexDirection={'row'}>
            <Tooltip title={"View Schedule"}>
                <IconButton color="secondary"
                    onClick={() => {props.setSchedule(props)}}>
                
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
                    <IconButton color="secondary" onClick={() => {
                        navigate(`/soar/${props.org}/${props.title}`)
                    }}>
                        <Edit />
                    </IconButton>
                </Tooltip>
            </AdminCheck>
        </Box>
    )
}

// View posted schedules
function View(props) {
    return (
        <Cards 
        data={props.data} 
        open={false}
        helperMessage={'There are currently no schedules to display. If that doesn\'t seem right, try refreshing the page.'} 
        icons={Icons} 
        add={
            <AdminCheck org={props.org} >
                <AddButton 
                text='New Schedule'
                tooltip='Open the Schedule Creator'
                url={'/soar/' + props.org}
                />
            </AdminCheck>
        }
        />
    )
}

function ViewOne(props) {
    const theme = useTheme();
    return (
        <Box>
            <Box sx={{padding: 2}}>
                <Typography
                variant="h4"
                >
                    {props.schedule.title}
                </Typography>
                <Typography>
                    {props.schedule.description}
                </Typography>
                <Typography>
                    {props.schedule.subtitle}
                </Typography>
            </Box>


            <Box display={'flex'} flexDirection={'row'} ml='20px'>
                {props.schedule.fields.map((field, oIndex) => (
                    <Box>
                        <Typography>
                            {field}
                        </Typography>
                        {
                            props.schedule.contents[0]
                            ?
                            props.schedule.contents.map((person, iIndex) => ((

                                <Box xs={6} display='flex' flexDirection={'row'} key={oIndex + ',' + iIndex} sx={{border: `1px solid ${theme.palette.primary.main}`}}>
                                    <Typography sx={{margin: 'auto', padding: 2, textAlign: 'center'}}>
                                        {person[field]
                                        ? 
                                        person[field]
                                        :
                                        '---'
                                        }
                                    </Typography>
                                </Box>
                            )))
                            :
                            ''
                        }
                    </Box>
                ))
                }
            </Box>
        </Box>
    )
}


function Internal(props) {
    const [ data, setData ] = useState([]);
    const [ schedule, setSchedule ] = useState();

    useEffect(() => {
        getAllSchedules(props.firebase.db, props.org, setData, setSchedule)
    }, [])

    return (
        <div>
            {
                schedule ?
                <ViewOne schedule={schedule} />
                :
                <View org={props.org} firebase={props.firebase} data={data} setSchedule={setSchedule} />
            }
        </div>
    )

}

// Main export
export default function Schedules(props) {
    return (
        <FbContext.Consumer>
            {firebase => (
                <Internal firebase={firebase} org={props.org} />
            )}
        </FbContext.Consumer>
    )
}