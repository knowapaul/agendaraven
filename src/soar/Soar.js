// React Resources
import { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { Box, Typography } from "@mui/material";

// Project Resources
import { bTheme, cTheme, mTheme, uTheme } from "../resources/Themes";
import { Schedule } from './editor/Schedule';

// Other Resources
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLoaderData, useNavigate } from "react-router-dom";
import AdminCheck from "../components/AdminCheck";
import AuthCheck from "../components/AuthCheck";
import { CustomSnackbar } from "../components/CustomSnackbar";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { getAllAvs, getPeople, getSchedule, saveSchedule } from "../resources/Firebase";
import AvFields from "./AvFields";
import DataImport from "./DataImport";
import { Bottom, Top } from './Headers';
import PeopleAvs from "./PeopleAvs";
import Automation from "./Automation";
import DashModel from "../components/DashModel";
import { AutoAwesome, CalendarMonth, Circle, DonutLarge, EventAvailable, FormatPaint, Group, Home, ImportantDevices, ImportExport, ScheduleOutlined } from "@mui/icons-material";


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
    return { ...params }
}

function LoadNav(props) {
    const navigate = useNavigate();
  
    useEffect(() => {
      navigate(props.to)
    }, [])
  
    return <div></div>
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

    // const [ tab, setTab ] = useState('schedule');

    const [ cats, setCats ] = useState({});

    const [ isSaved, setIsSaved ] = useState(true);

    const load = useLoaderData();
    const org = load.org;
    const tab = load.tab;

    // window.onbeforeunload = confirmExit;
    // function confirmExit() {
    //     return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
    // }

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
                setIsSaved(true)
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
        setFields: (v) => {setFields(v); setIsSaved(false)},
        
        items: items,
        setItems: (v) => {setItems(v); setIsSaved(false)},
        
        avFields: avFields,
        setAvFields: (v) => {setAvFields(v); setIsSaved(false)},
        
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
        setAvDate: (v) => {setAvDate(v); setIsSaved(false)},

        save: save,

        isSaved: isSaved,

        setIsSaved: setIsSaved,

        // setTab: setTab
    }


    const tabs = {
        schedule: <Schedule {...universalProps} />,
        forms: <AvFields {...universalProps} />, 
        import: <DataImport {...universalProps} />,
        availability: <PeopleAvs {...universalProps} />,
        automation: <Automation {...universalProps} />,
        all: <LoadNav to={`/${org}/schedules/`} />
    }

    const menu = [
        ["Schedule", <CalendarMonth color="secondary"/>],
        ["Forms", <EventAvailable color="secondary"/>],
        ["Import", <ImportantDevices color="secondary"/>],
        ["Availability",  <Group color="secondary"/>],
        ["Automation",  <AutoAwesome color="secondary"/>],
        ['1', ''],
        ['View All', <Home color="secondary" />]
      ]
    

    return (
        <ThemeProvider theme={uTheme}>  
            <AuthCheck>
                <AdminCheck org={org} helperText={"Sorry, this page is for authorized viewers only."}>
                    <DndProvider backend={HTML5Backend}>
                        <DashModel 
                        menuItems={menu} 
                        page={tab} 
                        title={tab} 
                        logo={{title: load.sch, href: `/${org}/schedules/${load.sch}/`}} 
                        path={`/soar/${org}/${load.sch}/`} 
                        >
                            {tabs[tab]}
                        </DashModel>
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