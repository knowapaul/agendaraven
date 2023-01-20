// React Resources
import { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";

// Project Resources
import { cTheme } from "../resources/Themes";
import { Schedule } from './editor/Schedule';

// Other Resources
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLoaderData } from "react-router-dom";
import AdminCheck from "../components/AdminCheck";
import AuthCheck from "../components/AuthCheck";
import { CustomSnackbar } from "../components/CustomSnackbar";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { getAllAvs, getPeople, getSchedule, saveSchedule } from "../resources/Firebase";
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

    const [ avs, setAllAvs ] = useState();
    const [ people, setPeople ] = useState();

    const [ highlight, setHighlight ] = useState();

    const [ tab, setTab ] = useState('schedule');

    const [ cats, setCats ] = useState({});

    const load = useLoaderData();
    const org = load.org;

    function getData() {
        console.log('running...', org, load.sch)
        getSchedule(org, load.sch, true, true).then((data) => {
            console.log('data', data)
            setTitle(data.title)
            setType(data.type)
            setFields(data.fields)
            setItems(data.contents)
            if (data.avFields) {setAvFields(data.avFields)}
            if (data.avDate) {setAvDate(data.avDate)}
            if (data.cats) {setCats(data.cats)}
        })
    }
    useEffect(() => {
        getData()
        getAllAvs(org, setAllAvs);
        getPeople(org, setPeople)
    }, [])

    function save(publish) {
        // Remove empty rows
        let ol = []
        for (let i in items) {
            if (items[i] !== {}) {
                ol = ol.concat(items[i])
            }
        }

        console.log('fields', fields)

        const data = {
            type: type,
            fields: fields,
            contents: ol,
            avFields: avFields,
            avDate: avDate,
            cats: cats,
            timestamp: new Date().toString()
        }

        console.log('savedata', data)
        
        saveSchedule(org, title, data)
            .then(() => {
                console.log('publish', publish)
                if (publish) {
                    return saveSchedule(org, title, data, true)
                } else {
                    return false;
                }
            })
            .then(() => {
                setOpen(true)
                getData()
            })
        
        
    }

    // Pass all schedule related states to children
    const universalProps = {
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

        cats: cats,
        setCats: setCats,

        highlight, 
        setHighlight, 

        avs: avs,
        setAllAvs: setAllAvs,
        people: people,
        
        avDate: avDate,
        setAvDate: setAvDate,

        save: save,

        setTab: setTab
    }


    const tabs = {
        schedule: <Schedule {...universalProps} />,
        forms: <AvFields {...universalProps} />, 
        import: <DataImport {...universalProps} />,
        availability: <PeopleAvs {...universalProps} />
    }

    return (
        <ThemeProvider theme={cTheme}>  
            <AuthCheck>
                <AdminCheck org={org} helperText={"Sorry, this page is for authorized viewers only."}>
                    <DndProvider backend={HTML5Backend}>
                        <Box width='100%' margin={0} height={'calc(100% - 64px)'} position={'fixed'} top='0px' left='0px'>
                            <Top {...universalProps} />
                            <ErrorBoundary>
                                <Box height={{xs: '100%'}} width={'100%'} >
                                    {tabs[tab]}
                                </Box>
                            </ErrorBoundary>
                            <Bottom {...universalProps} />
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