// React Resources
import { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd'

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { Box } from "@mui/material";

// Project Resources
import { cTheme } from "../resources/Themes";
import { Schedule } from './Schedule'

// Other Resources
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useLoaderData } from "react-router-dom";
import AdminCheck from "../components/AdminCheck";
import AuthCheck from "../components/AuthCheck";
import { Palette } from "./Palettes";
import { Top } from './Headers'
import { getSchedule, saveSchedule } from "../resources/Firebase";
import { CustomSnackbar } from "../components/CustomSnackbar";


// export async function newLoader({ params }) {
//     return { org: params.org }; 
// }

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

    const load = useLoaderData();
    const org = load.org;

    useEffect(() => {
        if (load.sch) {
            getSchedule(org, load.sch, setTitle, setType, setFields, setItems)
        }
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
            fields: fields,
            contents: ol,
            avFields: avFields,
            avDate: avDate,
            timestamp: new Date().toString()
        }

        console.log('data', data)
        
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
        
        setAvDate: setAvDate,
        save: save,
    }

    return (
        <ThemeProvider theme={cTheme}>  
            <AuthCheck>
                <AdminCheck org={org} helperText={"Sorry, this page is for authorized viewers only."}>
                    <DndProvider backend={HTML5Backend}>
                        <Box minWidth={915} width='100%' margin={0} height={'calc(100% - 64px)'} position={'fixed'} top='0px' left='0px'>
                            <Top {...inProps} />
                            <Box display={'flex'} flexDirection='row' height={'100%'}>
                                <Schedule {...inProps}/>
                                <Palette {...inProps}/>
                            </Box>
                        </Box> 
                    </DndProvider>      
                </AdminCheck>
            </AuthCheck>
            <CustomSnackbar 
            text={'Saved'}
            open={open}
            setOpen={setOpen}
            />
        </ThemeProvider>
    )
}