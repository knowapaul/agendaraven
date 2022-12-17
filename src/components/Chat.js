import { useTheme } from "@emotion/react";
import { Avatar, Box, Button, CircularProgress, IconButton, LinearProgress, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { GroupAdd, Send, Visibility } from "@mui/icons-material";
import Message from './Message'
import { createRef, useEffect, useState } from "react";
import { getMessaging } from 'firebase/messaging'
import { DbContext } from "../resources/Db";
import { getFunctions, httpsCallable } from "firebase/functions"
import { AppContext } from "../App";
import { getSubscriptions, getChatMessaging } from '../resources/HandleDb'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FbContext } from "../resources/Firebase";
import Loading, { MiniLoad } from "./Loading";


// This is one of the most complex widgets that is packaged in a single
// file. It is ideal this way, because with a single import, any component
// can add chat capabilities. To handle the complexity, this file is 
// extensively documented

const widgetHeight = 400;
const topHeight = 57.5;

/**
 * ### Internal component (used by Write)
 * 
 * Displays a single styled contact element for the chat header
 * 
 * @param  {map} props 
 * *React props:*
 * - props.people: the chat subscribers
 * - props.email: the project organization
 * - props.path: the path of the chat document (used to set the active chat)
 */ 
 function Contact(props) {
    let people = structuredClone(props.people);
    const index = people.includes(props.email) ? people.indexOf(props.email) : people.indexOf(props.email);
    people[index] = 'Me';
    const letter = props.people[(index === 0) ? 1 : 0][0].toUpperCase();
    const theme = useTheme();
    const white = 'white';
    const back = theme.palette.primary.main;
    const hover = 'rgba(255,255,255, .5)';
    
    return (
        <Tooltip title={people.join(',\n')}>
            <Box 
            sx={{
            padding: 1, 
            backgroundColor: props.path===props.chat ? white : back, 
            ':hover': {backgroundColor: props.path===props.chat ? white : hover},
            }} 
            onClick={() => {props.setChat(props.path)}}
            >
                <Avatar 
                sx={{
                color: theme.palette.text.primary, 
                backgroundColor: theme.palette.background.default, 
                }}
                >
                    {letter}
                </Avatar>
            </Box>
        </Tooltip>
    )
}

/**
 * ### Displays the messaging component
 * @param  {map} props
 * *React Props*
 * - props.firebase: the project firebase instance
 * - props.org: the project organization
 * - props.setWidget: the widget change function
 */ 
function Write(props) {
    const [ end, setEnd ] = useState();
    const [ messages, setMessages ] = useState();
    const [ unsub, setUnsub ] = useState(() => {});
    const [ subs, setSubs ] = useState({});
    const [ chat, setChat ] = useState();
    const [ text, setText ] = useState('');
    const [ sending, setSending ] = useState(false);
    const theme = useTheme();


    const buttonWidth = '70px'


    const messagesEndRef = createRef()

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView()
    })

    useEffect(() => {
        // TODO: return unsubscribe function
        getSubscriptions(db, props.org, user.uid)
            .then(subscription => {
                const defaultChat = Object.entries(subscription)[0][0]
                setSubs(subscription)
                setChat(defaultChat)
                setUnsub(getChatMessaging(db, defaultChat, setMessages))
            })
    }, [])

    const functions = props.firebase.functions;
    const auth = props.firebase.auth;
    const db = props.firebase.db;

    // const sendChatMessage = httpsCallable(functions, 'sendChatMessage');
    const user = auth.currentUser;

    const sendChatMessage = httpsCallable(functions, 'sendChatMessage');

    const handleSend = () => {
        if (text) {
            console.log('sending')
            setSending(true)
            sendChatMessage({
                orgName: props.org,
                body: text,
                recipients: subs[chat],
                oldChat: chat
            }).then(() => {
                setText('')
                setSending(false)
                console.log('sent')
            }).catch((error) => {
                console.log('error', error)
                setSending(false)
            })
        }
    }
    

    return (
            <div>
                <Box sx={{ display: 'flex', borderBottom: 'solid', outlineColor: theme.palette.background.default, height: '57.5px'}}>
                    <Box sx={{display: 'flex', flexGrow: 1}} >
                        <Stack direction="row" spacing={1}>
                            {subs ? Object.entries(subs).map(ent => {
                                return (
                                    <Contact people={ent[1]} key={ent[0]} path={ent[0]} email={auth.currentUser.email} chat={chat} setChat={setChat} />
                                )
                            }) : ''}
                        </Stack>
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="View All Chats">
                            <Button 
                            disableElevation 
                            variant="contained" 
                            sx={{ width: buttonWidth,
                                backgroundColor: theme.palette.text.primary, 
                                borderRadius: '0px',
                                height: '100%',
                                width: topHeight,
                                color: theme.palette.background.default, 
                                ':hover': {backgroundColor: 'rgba(255, 255, 255, .5)'}
                            }}
                            onClick={() => {props.setWidget('view')}}
                            >
                                <Visibility fontSize="large" sx={{margin: '0px'}}/>
                            </Button>
                        </Tooltip>
                        <Tooltip title="Create New Chat">
                            <Button 
                            disableElevation 
                            variant="contained" 
                            sx={{ width: buttonWidth,
                                backgroundColor: theme.palette.text.primary, 
                                borderRadius: '0px',
                                height: '100%',
                                width: topHeight,
                                color: theme.palette.background.default, 
                                ':hover': {backgroundColor: 'rgba(255, 255, 255, .5)'}
                            }}
                            onClick={() => {props.setWidget('new')}}
                            >
                                <GroupAdd fontSize="large"/>
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
                <Box  sx={{margin: 1 }} height={`${window.innerHeight - 149 -64}px`} overflow='auto'>
                    {messages ? 
                            messages.messages.map(message => {
                                const side = message.sender === user.email ? 'right' : 'left'
                                return (
                                    <Message side={side} body={message.body} key={message.sender + message.timestamp}/>
                                )
                            }) : 
                            <MiniLoad />
                            }
                    <div style={{ float:"left", clear: "both" }}
                        ref={messagesEndRef}>
                    </div>
                </Box>
                <Box sx={{height: '2px'}}>{sending ? <LinearProgress sx={{backgroundColor: 'white'}}/> : ''}</Box>
                <Box sx={{padding: 1, borderTop: 'solid', outlineColor: theme.palette.background.default, borderRadius: 0, }}>
                    
                    <TextField 
                    placeholder="Type message here" 
                    sx={{ width: `calc(100% - ${buttonWidth})`}}
                    variant="outlined"
                    multiline
                    maxRows={4}
                    value={text}
                    onChange={(event) => {setText(event.target.value)}}
                    >
                    </TextField>
                    <Button 
                    disableElevation 
                    variant="contained" 
                    sx={{pt: 2, pb: 2, width: buttonWidth,
                    }}
                    onClick={handleSend}
                    >
                        <Send />
                    </Button>
                </Box>
            </div>
    )

}

/**
 * ### Displays the recipient selector widget in place of the default Write() element
 * 
 * @param  {Map} props
 * *React Props*
 * - 
 */
function NewChat(props) {
    const theme = useTheme();
    return (
        <div>
            <Box sx={{ display: 'flex', borderBottom: 'solid', outlineColor: theme.palette.background.default, height: '57.5px'}}>

            </Box>
        </div>
    )
}



/**
 * ### Display a chat widget on the screen
 * 
 * Automatically imports all necessary firebase resources
 * Acts as the router for the Write, NewChat, 
 * 
 * @param  {map} props
 * *React Props*
 * - props.org: the organization  (used for database locating)
 */
export default function Chat(props) {
    const [ widget, setWidget ] = useState('chat');
    return (
        <FbContext.Consumer>
            {firebase => {
                return (
                    <Box>
                        { widget === 'chat' ? 
                        <Write firebase={firebase} org={props.org} setWidget={setWidget}/> 
                        : 
                        <NewChat />
                        }
                    </Box>
                    
                )
            }}
        </FbContext.Consumer>
    )
}