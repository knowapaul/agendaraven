import { useTheme } from "@emotion/react";
import { Avatar, Box, Button, CircularProgress, Paper, Stack, TextField, Tooltip } from "@mui/material";
import { Send } from "@mui/icons-material";
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

function Contact(props) {
    let people = structuredClone(props.title);
    const index = people.includes(props.email) ? people.indexOf(props.email) : people.indexOf(props.email);
    people[index] = 'Me';
    console.log('position', (index === 0) ? 1 : 0)
    const letter = props.title[(index === 0) ? 1 : 0][0].toUpperCase();
    const white = 'white';
    const back = props.theme.palette.primary.main;
    const hover = 'rgba(255,255,255, .5)';
    
    return (
        <Tooltip title={people.join(',\n')}>
            <Box 
            sx={{
            padding: 1, 
            backgroundColor: props.name===props.chat ? white : back, 
            ':hover': {backgroundColor: props.name===props.chat ? white : hover},
            }} 
            onClick={() => {console.log('clicked'); props.setChat(props.name)}}
            >
                <Avatar 
                sx={{
                color: props.theme.palette.text.primary, 
                backgroundColor: props.theme.palette.background.default, 
                }}
                >
                    {letter}
                </Avatar>
            </Box>
        </Tooltip>
    )
}



export default function Chat(props) {
    
    return (
        <FbContext.Consumer>
            {firebase => {
                return (
                    <Internal firebase={firebase} org={props.org}/>
                )
            }}
        </FbContext.Consumer>
    )
}

function Internal(props) {
    const [ end, setEnd ] = useState();
    const [ messages, setMessages ] = useState();
    const [ unsub, setUnsub ] = useState(() => {});
    const [ subs, setSubs ] = useState({});
    const [ chat, setChat ] = useState();
    const [ text, setText ] = useState('');
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
                setSubs(subscription)
                setUnsub(getChatMessaging(db, Object.entries(subscription)[0][0], setMessages))
            })
    }, [])

    const functions = props.firebase.functions;
    const auth = props.firebase.auth;
    const db = props.firebase.db;

    // const sendChatMessage = httpsCallable(functions, 'sendChatMessage');
    const user = auth.currentUser;

    const sendChatMessage = httpsCallable(functions, 'sendChatMessage');

    const handleSend = () => {
        console.log('sending')
        sendChatMessage({
            orgName: props.org,
            body: text,
            recipients: subs[chat],
            oldChat: chat
        }).then(() => {
            setText('')
            console.log('sent')
        })
    }
    

    return (
        <div>
            
            <div>
                <Box sx={{borderBottom: 'solid', outlineColor: theme.palette.background.default}}>
                    <Stack direction="row" spacing={1}>
                        {subs ? Object.entries(subs).map(ent => {
                            return (
                                <Contact title={ent[1]} key={ent[0]} name={ent[0]} theme={theme} email={auth.currentUser.email} chat={chat} setChat={setChat} />
                            )
                        }) : ''}
                    </Stack>
                </Box>
                <Box  sx={{margin: 1 }} height={200} overflow='auto'>
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
                    outlineColor: theme.palette.primary.main
                    }}
                    onClick={handleSend}
                    >
                        <Send />
                    </Button>
                </Box>
            </div>
        </div>
    )

}