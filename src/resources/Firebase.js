// Firebase Resources
import { collection, doc, getDoc, setDoc, onSnapshot, getDocs, Query, query, QuerySnapshot, namedQuery } from "firebase/firestore"; 
import { ref, getDownloadURL, uploadBytes, listAll } from "firebase/storage"; 

import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { Typography } from "@mui/material";


let countCalls = 0;
let savedCalls = 0;

let reuseDocs = {};
let pendingDocs = {};
let imageURLs = {}

let auth;
let db;
let functions;
let storage;


export function setApp(app) {
    auth = getAuth(app);
    // connectAuthEmulator(auth, "http://localhost:9099")
    db = getFirestore(app);
    // connectFirestoreEmulator(db, 'localhost', 8080);
    functions = getFunctions(app);
    // connectFunctionsEmulator(functions, 'localhost', 5001);
    storage = getStorage(app);
    // connectStorageEmulator(storage, 'localhost', 9199);
}


async function getData(colPath, docPath, refresh) {
    if (reuseDocs[colPath + '/' + docPath] && !refresh) {
        savedCalls++;
        return reuseDocs[colPath + '/' + docPath]
    } else if (pendingDocs[colPath + '/' + docPath] && !refresh) {
        savedCalls++;
        const snap = await pendingDocs[colPath + '/' + docPath]
        return snap.data();
    } else {
        countCalls++;
        console.log('calls, saved, ', countCalls, ',', savedCalls)

        const promise = getDoc(doc(db, colPath, docPath))
        pendingDocs[colPath + '/' + docPath] = promise;

        const snap = await promise;
        const data = snap.data();
        reuseDocs[colPath + '/' + docPath] = data;
        delete pendingDocs[colPath + '/' + docPath];

        return data;
    }
}

// TODO: Add an isolated document for user subscription data?
export function addUserAccount(data, user) {
    console.log('adduseraccount')
    const users = collection(db, 'users')

    const cData = Object.assign({schedulename: data.firstname}, data)

    return setDoc(
        doc(users, user.uid),
        {
            info: cData,
            orgs: {},
        }
    )
}

// TODO: Make these secure with rules
export async function getSubscriptions(org, uid) {
    console.log('getsubscriptions')

    return await getData(`${org}chat`, uid);
}

export async function getChatMessaging(location, setMessages) {
    // console.log('getchatmessaging')

    // const unsub = onSnapshot(doc(db, location), (doc) => {
    //     setMessages(doc.data())
    // });
    // return unsub;
}

export async function getUserData() {
    console.log('getuserdata')
    return await getData('users', auth.currentUser.uid);
}

export async function initDatabase() {
    console.log('initdatabase')

    const data = await getData('index', 'organizations')
    if (data === undefined) {
        // Set invalid organization names
        setDoc(
            doc(db, 'index', 'organizations'),
            {
                dashboard: true,
                about: true,
                logout: true,
                createaccount: true,
                loading: true,
            }
        )
    }

    // const users = doc(db, `users`, 'index')
    // const usersSnap = await getDoc(orgs)
    // if (!usersSnap.exists) {
    //     // Guarantees the users collection exists
    //     setDoc(
    //         doc('users', 'index'),
    //         {
                
    //         }
    //     )
    // }
}

// TODO: look at this
export async function getRolesDoc(org, setDoc, setLoading, refresh) {
    console.log('getrolesdoc')
    console.log('org, setDoc, setLoading,',org, setDoc, setLoading,)

    setLoading(true)

    const data = await getData(org + 'data', 'roles', refresh)
    console.log('data1', data)
    setDoc(data);
    setLoading(false)
}

export async function getPeople(org, setPeople) {
    console.log('getpeople')

    const people = await getData(org + 'chat', 'index');

    let adaptedPeople = {};
    for (let i in people) {
        adaptedPeople[people[i].fullname] = Object.assign(people[i], {email: i})
    }

    setPeople(adaptedPeople)
}

export async function checkAdmin(org, setIsAdmin) {
    console.log('checkadmin')

    const uid = auth.currentUser.uid

    const data = await getData(org + 'users', 'roles');

    try {
        setIsAdmin(data[uid].includes('owner'))
    } catch (error) {
        console.log('Error:')
        console.error(error.message)
        setIsAdmin(false)
    }
}

export async function getMemo(org, setTitle, setPerson, setContents) {
    console.log('getmemo')

    const data = await getData(org + 'data', 'memo');

    setTitle(data.title)
    setPerson(data.person)
    setContents(data.contents)
}

export function setMemo(org, title, contents) {
    console.log('setmemo')

    const orgData = collection(db, org + 'data')

    console.log('auth', auth)

    return setDoc(
        doc(orgData, 'memo'),
        {
            title: title,
            contents: contents,
            person: auth.currentUser.displayName
        }
    )
}

// TODO: Make this secure with rules
export function saveSchedule(org, title, data) {
    console.log('saveschedule')

    const orgSch = collection(db, org + 'schedules')

    return setDoc(
        doc(orgSch, title),
        data, {merge: true}
    )
}

export function saveAvailability(org, schedule, data) {
    console.log('saveschedule')

    console.log('dat', data)

    const orgSch = collection(db, org + 'data')

    return setDoc(
        doc(orgSch, schedule + '--avs'),
        {[auth.currentUser.uid]: data},
        {merge: true}
    )
}

export async function getSchedule(org, title, setTitle, setType, setFields, setContents) {
    console.log('getschedule')

    const data = await getData(org + 'schedules', title);

    setTitle(data.title)
    setType(data.type)
    setFields(data.fields)
    setContents(data.contents)
}

export async function getAllSchedules(org, setContents, setSchedule) {
    console.log('getallschedules')

    const snaps = await getDocs(collection(db, org + "schedules"));

    const description = (snap) => (
        (snap.data().avDate
        ?
        `Availability Due: ${new Date(snap.data().avDate).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})}\n`
        :
        '')
        +
        (snap.data().timestamp
        ?
        `Last Edited: ${new Date(snap.data().timestamp).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})}`
        :
        '')
    )

    setContents(
        snaps.docs.map((snap) => ({
            title: snap.data().title,
            description: description(snap),
            subtitle: snap.data().type,
            fields: snap.data().fields,
            contents: snap.data().contents,
            avDate: snap.data().avDate,
            avFields: snap.data().avFields,
            org: org,
            setSchedule: setSchedule,
        }))
    )
}

export function getFirebase() {
    return {
        auth: auth,
        db: db,
        functions: functions,
        storage: storage
    }
}



//------------------------------------
// Storage




export function accessImage(location, setURL) {
    if (imageURLs[location]) {
        setURL(imageURLs[location])
    } else {
        getDownloadURL(ref(storage, location))
            .then((url) => {
                imageURLs[location] = url;
                setURL(url)
            })
            .catch((error) => {
                setURL('ERROR')
            });
    }
}

export async function uploadFile(file, root, unique) {
    const loc =  (root ? root : '') + (unique ? '' : file.name);

    const storageRef = ref(storage, loc);

    // 'file' comes from the Blob or File API
    return uploadBytes(storageRef, file)
}

export async function getOrgFiles(path, setFiles) {
    const listRef = ref(storage, path);

    // Find all the prefixes and items.
    const res = await listAll(listRef);
    setFiles(res.items)
}