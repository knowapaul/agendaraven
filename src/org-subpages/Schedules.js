// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { Edit, Visibility } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from "@mui/material";

// Project Resources
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import AdminCheck from "../components/AdminCheck";
import Cards from "../components/Cards";
import { ErrorBoundary } from "../components/ErrorBoundary";
import Form from "../components/Form";
import { getAllSchedules, internalCheckAdmin, saveSchedule } from "../resources/Firebase";
import MiniScroll from "../components/MiniScroll";


{/* <Tooltip title={"My Availability"}>
    <IconButton color="secondary">
        <EventAvailable />
    </IconButton>
</Tooltip> */}

// Options for the View component
function Icons(props) {
    const navigate = useNavigate();
    return (
        <Box display={'flex'} flexDirection={'row'}>
            <Tooltip title={"View Schedule"} sx={{display: props.published ? 'initial' : 'none'}}>
                <IconButton color="secondary"
                    onClick={() => {navigate(`/${props.org}/schedules/${props.title}`)}}>
                
                    <Visibility />
                </IconButton>
            </Tooltip>
            
            <AdminCheck org={props.org}>
                <Tooltip title={"Edit Schedule"}>
                    <IconButton color="secondary" onClick={() => {
                        navigate(`/soar/${props.org}/${props.title}/schedule`)
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
    const [ data, setData ] = useState({schedulename: '', scheduletype: ''});
    const [ open, setOpen ] = useState(false);
    const [ error, setError ] = useState();
    const [ display, setDisplay ] = useState();
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    function handleSubmit() {
        saveSchedule(props.org, data.schedulename, {
            title: data.schedulename, 
            type: data.scheduletype,
            contents: [],
            fields: [],
            timestamp: new Date().toString()
        })
            .then(() => {
                console.log('sucess!')
                navigate(`/soar/${props.org}/${data.schedulename}/schedule`)
            })
            .catch((e) => {
                console.log(e)
                setError(e.message)
            })
    }

    useEffect(() => {
        let displayDat = [];
        internalCheckAdmin(props.org).then((isAdmin) => {
            props.data.forEach((item) => {
                console.log('item', item, isAdmin)
                if (item.published || isAdmin) {
                    displayDat = displayDat.concat(item)
                }
            })
            setDisplay(displayDat)
            setLoading(false)
        })
    }, [props.data])

    return (
        <div>

            <Cards 
            data={display} 
            loading={loading}
            open={true}
            noHeader={props.noHeader}
            setOpen={() => {}}
            helperMessage={"There are currently no schedules to display. If that doesn't seem right, try refreshing the page."} 
            icons={Icons} 
            add={
                <AdminCheck org={props.org} >
                    <AddButton 
                    open={open}
                    setOpen={setOpen}
                    text='New Schedule'
                    tooltip='Create a schedule'
                    formTitle='Create a schedule'
                    form={
                        <Form
                        inputs={[
                            {title: 'Schedule Name', placeholder: 'Case sensitive', type: 'text', required: true, validate: 'document'},
                            {title: 'Schedule Type', placeholder: 'Describe your schedule', type: 'text', required: true, validate: 'text'},
                        ]}
                        data={data}
                        setData={setData}
                        buttonText={'Go to SOAR'}
                        handleSubmit={handleSubmit}
                        formError=''
                        />
                    }
                    formError={error}
                    />
                </AdminCheck>
            }
            />
        </div>
    )
}


// Main export
export default function Schedules(props) {
    const [ data, setData ] = useState([]);

    useEffect(() => {
        getAllSchedules(props.org, setData)
    }, [])

    return (
        <ErrorBoundary>
            <View {...props} data={data} />
        </ErrorBoundary>
    )
}