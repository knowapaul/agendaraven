import { useTheme } from "@emotion/react";
import { Avatar, Box, Button, Chip, CircularProgress, Divider, IconButton, LinearProgress, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { ArrowBack, GroupAdd, Send, Visibility } from "@mui/icons-material";
import Message from '../components/Message'
import { createRef, useEffect, useState } from "react";
import { getMessaging } from 'firebase/messaging'
import { DbContext } from "../resources/Db";
import { getFunctions, httpsCallable } from "firebase/functions"
import { AppContext } from "../App";
import { getSubscriptions, getChatMessaging } from '../resources/HandleDb'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FbContext } from "../resources/Firebase";
import Loading, { MiniLoad } from "../components/Loading";
import UserSearch from "../components/UserSearch";


// This is one of the most complex widgets that is packaged in a single
// file. It is ideal this way, because with a single import, any component
// can add chat capabilities. To handle the complexity, this file is 
// extensively documented

const widgetHeight = 400;
const topHeight = 57.5;
const buttonWidth = '70px'

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
    const front = theme.palette.background.default;
    const back = theme.palette.primary.main;
    const hover = 'rgba(255,255,255, .5)';
    
    return (
        <NavButton 
        bg = {props.chat === props.path ? front : back}
        hover={props.chat === props.path ? front : hover}
        handleClick={props.handleClick}
        tab={true}
        title={people.join(',\n')}
        >
            <Avatar 
            sx={{
                margin: '0px'
            }}
            >
                {letter}
            </Avatar>
        </NavButton>
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
            setSending(true)
            sendChatMessage({
                orgName: props.org,
                body: text,
                recipients: subs[chat],
                oldChat: chat
            }).then(() => {
                setText('')
                setSending(false)
            }).catch((error) => {
                setSending(false)
            })
        }
    }
    
    const selectChat = (c) => {
        setChat(c)
        setUnsub(getChatMessaging(db, c, setMessages))
    }

    return (
            <Box>
                <ChatNav>
                    <Box sx={{display: 'flex', flexGrow: 1}} >
                        <Stack direction="row">
                            {subs ? Object.entries(subs).map(ent => {
                                return (
                                    <Contact people={ent[1]} key={ent[0]} path={ent[0]} email={auth.currentUser.email} chat={chat} setChat={setChat} handleClick={() => {selectChat(ent[0])}}/>
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
                                borderRadius: '0px',
                                height: '100%',
                                width: topHeight,
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
                                borderRadius: '0px',
                                height: '100%',
                                width: topHeight,
                            }}
                            onClick={() => {props.setWidget('new')}}
                            >
                                <GroupAdd fontSize="large"/>
                            </Button>
                        </Tooltip>
                    </Box>
                </ChatNav>
                <Box height={'calc(100vh - 58px - 72px - 64px)'} overflow='auto'>
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
                <Paper square elevation={24} sx={{height: '2px'}}>{sending ? <LinearProgress sx={{}}/> : ''}</Paper>
                <Paper square sx={{padding: 1}}>
                    
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
                </Paper>
            </Box>
    )

}

function NavButton(props) {
    return (
        <Tooltip title={props.title}>
            <Button 
            disableElevation 
            variant="contained" 
            sx={{
                borderRadius: '0px',
                borderTopRightRadius: props.tab ? 6 : 0,
                borderTopLeftRadius: props.tab ? 6 : 0,
                height: '100%',
                boxShadow: 'none', 
                backgroundColor: props.bg,
                '&:hover': {
                    backgroundColor: props.hover,
                },
            }}
            onClick={props.handleClick}
            >
                {props.children}
            </Button>
        </Tooltip>
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
    const [ selected, setSelected ] = useState({});
    const theme = useTheme();

    const sendChatMessage = httpsCallable(props.firebase.functions, 'sendChatMessage');

    function createChat() {
        const emails = Object.entries(selected).map((ent) => (ent[1].email))
        sendChatMessage({
            orgName: props.org,
            body: '-',
            recipients: emails
        })
        props.setWidget('chat')
    }
    return (
        <div>
            <ChatNav>
                    <Box sx={{flexGrow: 1}}>
                        <NavButton title="Return to chat" handleClick={() => {props.setWidget('chat')}}>
                            <ArrowBack sx={{mr: 1}} />
                            Back 
                        </NavButton>
                    </Box>
                    <Typography variant='h5' noWrap sx={{margin: 'auto', flexGrow: 1}}>
                        Select Recipients
                    </Typography>
                    <Box sx={{flex: 0}}>
                        <NavButton title="Send Welcome Message" handleClick={createChat}>
                            <Send sx={{mr: 1}} />
                            Create 
                        </NavButton>
                    </Box>
            </ChatNav>
            <Box 
            sx={{ml: 2, mt: 1}}
            >
                <Typography
                variant="subtitle1"
                display={'inline'}
                >
                    To: 
                </Typography>
                {Object.keys(selected).map(key => {
                    function handleDelete() {
                        let clone = Object.assign({}, selected)
                        delete clone[key]
                        setSelected(clone)
                    }
                    return (
                        <Chip key={key} label={key} color="primary" onDelete={handleDelete} sx={{margin: .5}} />
                    )
                })}
            </Box>
            <UserSearch firebase={props.firebase} org={props.org} selected={selected} setSelected={setSelected} button={''} multiple={true}>

            </UserSearch>
        </div>
    )
}

function ChatNav(props) {
    return (
        <Paper elevation={0} sx={{ display: 'flex', borderRadius: '0px', height: '57.5px'}}>
            {props.children}
        </Paper>
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
                        <NewChat firebase={firebase} org={props.org} setWidget={setWidget} />
                        }
                    </Box>
                    
                )
            }}
        </FbContext.Consumer>
    )
}