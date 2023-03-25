// React Resources
import { useCallback, useEffect, useState } from "react";
import { DndProvider } from 'react-dnd';

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { Box, Tooltip, Typography } from "@mui/material";

// Project Resources
import { uTheme } from "../resources/Themes";
import { Schedule } from './editor/Schedule';

// Other Resources
import { AutoAwesome, CalendarMonth, EventAvailable, Group, GroupWork, Home, ImportantDevices, Settings } from "@mui/icons-material";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import AdminCheck from "../components/AdminCheck";
import AuthCheck from "../components/AuthCheck";
import { CustomSnackbar } from "../components/CustomSnackbar";
import DashModel from "../components/DashModel";
import { getAllAvs, getPeople, getSchedule, saveSchedule } from "../resources/Firebase";
import Automation from "./Automation";
import AvFields from "./AvFields";
import DataImport from "./DataImport";
import { Top } from './Headers';
import Parameters from "./Parameters";
import PeopleAvs from "./PeopleAvs";
import SoarSettings from "./SoarSettings";


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
    }, [navigate, props.to])
  
    return <div></div>
}
  
function Logo(props) {
    return (
        <Link to={`/${props.org}/schedules/${props.title}`} style={{textDecoration: 'none'}}>
            <Tooltip title="View as a User">
                <Box 
                flex={1} 
                height='100%' 
                sx={{display: 'flex',
                    alignItems: 'center',
                    
                }}
                >
                    <Box paddingLeft={2}>
                    <Typography variant={'h5'} color={uTheme.palette.primary.main}>
                        {props.title}
                    </Typography>
                    <Typography variant="subtitle2" color={uTheme.palette.primary.main}>
                        {props.type}
                    </Typography>
                    </Box>
                </Box>
            </Tooltip>
        </Link>
    )
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

    const [ funcs, setFuncs ] = useState({});
    const [ params, setParams ] = useState({});
    const [ paramFields, setParamFields ] = useState([]);

    const [ selectTargets, setSelectTargets ] = useState(false);
    const [ targets, setTargets ] = useState([]);

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

    const getData = useCallback(() => {
        getSchedule(org, load.sch, true, true).then((data) => {
            setTitle(load.sch)
            setType(data.type)
            setFields(data.fields)
            setItems(data.contents)
            if (data.paramFields) {setParamFields(data.paramFields)};
            if (data.params) {setParams(data.params)};
            if (data.avFields) {setAvFields(data.avFields)}
            if (data.avDate) {setAvDate(data.avDate)}
            if (data.cats) {setCats(data.cats)}
            let unpackedFuncs = {};
            Object.entries(data.funcs).forEach(
                (item) => {
                    unpackedFuncs[item[0]] = item[1].split(';').map((line) => (line.split(',')))
                }
            )
            if (data.funcs) {setFuncs(unpackedFuncs)}
        })
      }, [load.sch, org])
      
    useEffect(() => {
        getData()
        getAllAvs(org, setAllAvs);
        getPeople(org, setPeople)
    }, [org, getData])

    const handleShortcuts = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
            e.preventDefault()
            save()
        }
    }

    document.onkeydown = handleShortcuts

    async function save(location) {
        // Remove empty rows
        let ol = []
        for (let i in items) {
            if (items[i] !== {}) {
                ol = ol.concat(items[i])
            }
        }

        let tempFuncs = {...funcs}
        Object.keys(tempFuncs).forEach((key) => {tempFuncs[key] = tempFuncs[key].join(';')})
        const data = {
            type: type,
            fields: fields,
            contents: ol,
            avFields: avFields,
            avDate: avDate,
            cats: cats,
            funcs: tempFuncs,
            paramFields: paramFields,
            params: params,
            timestamp: new Date().toString()
        }

        console.log('savedata', data)
        
        await saveSchedule(org, title, data, location)

        if (location !== 'archive') {
            setIsSaved(true)
            getData()
        }

        return;
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

        cats: cats,
        setCats: setCats,

        highlight, 
        setHighlight, 

        avs: avs,
        setAllAvs: setAllAvs,
        people: people,
        
        avDate: avDate,
        setAvDate: (v) => {setAvDate(v); setIsSaved(false)},

        funcs: funcs,
        setFuncs: (v) => {setFuncs(v); setIsSaved(false)},

        params: params,
        setParams: (v) => {setParams(v); setIsSaved(false)},

        paramFields: paramFields,
        setParamFields: (v) => {setParamFields(v); setIsSaved(false)},

        selectTargets: selectTargets,
        setSelectTargets: setSelectTargets,

        targets: targets,
        setTargets: setTargets,

        save: save,

        isSaved: isSaved,
        setIsSaved: setIsSaved,

        tab: tab,
    }


    const tabs = {
        schedule: <Schedule {...universalProps} />,
        forms: <AvFields {...universalProps} />, 
        import: <DataImport {...universalProps} />,
        availability: <PeopleAvs {...universalProps} />,
        automation: <Automation {...universalProps} />,
        all: <LoadNav to={`/${org}/schedules/`} />,
        parameters: <Parameters {...universalProps} />,
        settings: <SoarSettings {...universalProps} />
    }

    const menu = [
        ["Schedule", <CalendarMonth color="secondary"/>],
        ["Forms", <EventAvailable color="secondary"/>],
        ["Import", <ImportantDevices color="secondary"/>],
        ["Availability",  <Group color="secondary"/>],
        ['1', ''],
        ["Automation",  <AutoAwesome color="secondary"/>],
        ["Member Parameters",  <GroupWork color="secondary"/>],
        ["Settings",  <Settings color="secondary"/>],
        ['2', ''],
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
                        customLogo={<Logo {...universalProps} />} 
                        path={`/soar/${org}/${load.sch}/`} 
                        customHeader={<Top {...universalProps} />}
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