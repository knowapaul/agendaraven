// React Resources
import { useState } from "react";
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
import { getSchedule } from "../resources/Firebase";


export async function newLoader({ params }) {
    return { org: params.org }; 
}

export async function schLoader({ params }) {
    return { org: params.org, sch: params.sch }
}

/**
 * ## The Soar Scheduling Component
 * 
 * @param  {Map} props
 */
export default function Soar() {
    const [ palette, setPalette ] = useState('fields')
    const [ fields, setFields ] = useState([]);
    const [ items, setItems ] = useState([]);
    const [ title, setTitle ] = useState('Untitled-1');
    const [ type, setType ] = useState('type');
    const load = useLoaderData();
    const org = load.org;

    if (load.sch) {
        getSchedule(org, load.sch, setTitle, setType, setFields, setItems)
    }

    return (
        <ThemeProvider theme={cTheme}>  
            <AuthCheck>
                <AdminCheck org={org} helperText={"Sorry, this page is for authorized viewers only."}>
                    <DndProvider backend={HTML5Backend}>
                        <Box minWidth={915} width='100%' margin={0} height={'calc(100% - 64px)'} position={'fixed'} top='0px' left='0px'>
                            <Top 
                            org={org} 
                            fields={fields} 
                            contents={items} 
                            sch={load.sch} 
                            title={title}
                            setTitle={setTitle}
                            type={type} 
                            setType={setType}
                            />
                            <Box display={'flex'} flexDirection='row' height={'100%'}>
                                <Schedule 
                                palette={palette} 
                                setPalette={setPalette} 
                                fields={fields}
                                setFields={setFields}
                                people={items}
                                setPeople={setItems}
                                items={items}
                                />
                                <Palette palette={palette} setPalette={setPalette} org={org} fields={fields} />
                            </Box>
                        </Box> 
                    </DndProvider>      
                </AdminCheck>
            </AuthCheck>
        </ThemeProvider>
    )
}