// React Resources
import { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";

// Project Resources
import { cTheme } from "../resources/Themes";
import { Schedule } from './Schedule';

// Other Resources
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLoaderData } from "react-router-dom";
import AdminCheck from "../components/AdminCheck";
import AuthCheck from "../components/AuthCheck";
import { CustomSnackbar } from "../components/CustomSnackbar";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { getSchedule, saveSchedule } from "../resources/Firebase";
import AvFields from "./AvFields";
import DataImport from "./DataImport";
import { Bottom, Top } from './Headers';
import PeopleAvs from "./PeopleAvs";


// export async function newLoader({ params }) {
//     return { org: params.org }; 
// }

/*
This is the most important component of all of AgendaRaven.
It's where all the magic happens. As a result, much of the 
time working on the program should be spent here. This is 
the main selling point of the program, and its success and 
user-friendliness is vital to the success of the program.
*/

export async function schLoader({ params }) {
    return { org: params.org, sch: params.sch }
}

/**
 * ## The Soar Scheduling Component
 * 
 * @param  {Map} props
 */
export default function Soar() {
    const [ open, setOpen ] = useState(false);

    const [ palette, setPalette ] = useState('fields')
    const [ fields, setFields ] = useState([]);
    const [ items, setItems ] = useState([]);
    const [ title, setTitle ] = useState('Untitled-1');
    const [ type, setType ] = useState('type');

    const [ avFields, setAvFields ] = useState([]);
    const [ avDate, setAvDate ] = useState('');

    const [ tab, setTab ] = useState('schedule');

    const load = useLoaderData();
    const org = load.org;

    useEffect(() => {
        getSchedule(org, load.sch).then((data) => {
            setTitle(data.title)
            setType(data.type)
            setFields(data.fields)
            setItems(data.contents)
            setAvFields(data.avFields)
            setAvDate(data.avDate)
        })
    }, [])

    function save() {
        // Remove empty rows
        let ol = []
        for (let i in items) {
            if (items[i] !== {}) {
                ol = ol.concat(items[i])
            }
        }

        const data = {
            type: type,
            fields: fields,
            contents: ol,
            avFields: avFields,
            avDate: avDate,
            timestamp: new Date().toString()
        }
        
        saveSchedule(org, title, data)
            .then(() => {
                setOpen(true)
            })
    }

    const inProps = {
        org: org,
        sch: load.sch, 

        title: title,
        setTitle: setTitle,

        type: type, 
        setType: setType,
        
        palette: palette, 
        setPalette: setPalette, 
        
        fields: fields,
        setFields: setFields,
        
        items: items,
        setItems: setItems,
        
        avFields: avFields,
        setAvFields: setAvFields,
        
        palette: palette,
        setPalette: setPalette,
        
        avDate: avDate,
        setAvDate: setAvDate,
        save: save,

        setTab: setTab
    }


    const tabs = {
        schedule: <Schedule {...inProps} />,
        forms: <AvFields {...inProps} />, 
        import: <DataImport {...inProps} />,
        availability: <PeopleAvs {...inProps} />
    }

    return (
        <ThemeProvider theme={cTheme}>  
            <AuthCheck>
                <AdminCheck org={org} helperText={"Sorry, this page is for authorized viewers only."}>
                    <DndProvider backend={HTML5Backend}>
                        <Box width='100%' margin={0} height={'calc(100% - 64px)'} position={'fixed'} top='0px' left='0px'>
                            <Top {...inProps} />
                            <ErrorBoundary>
                                <Box height={{xs: '100%'}} width={'100%'} >
                                    {tabs[tab]}
                                </Box>
                            </ErrorBoundary>
                            <Bottom {...inProps} />
                        </Box> 
                    </DndProvider>      
                </AdminCheck>
            </AuthCheck>
            <CustomSnackbar 
            severity='success'
            text={'Saved'}
            open={open}
            setOpen={setOpen}
            />
        </ThemeProvider>
    )
}