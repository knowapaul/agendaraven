// Firebase Resources
import { collection, doc, getDoc, setDoc, onSnapshot, getDocs, Query, query, QuerySnapshot, namedQuery, writeBatch } from "firebase/firestore"; 
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
let imageURLs = {};
let orgFiles = {};
let allAvs;

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

/** Wipes all saved document data and forces a refresh.
 */
export function reloadAllDocs() {
    reuseDocs = {};
    pendingDocs = {};
}

async function getData(path, refresh) {
    try {
        if (reuseDocs[path] && !refresh) {
            savedCalls++;
            return reuseDocs[path]
        } else if (pendingDocs[path] && !refresh) {
            savedCalls++;
            const snap = await pendingDocs[path]
            return snap.data();
        } else {
            countCalls++;
            console.log('calls, saved, ', countCalls, ',', savedCalls)
    
            const promise = getDoc(doc(db, path))
            pendingDocs[path] = promise;
    
            const snap = await promise;
            const data = snap.data();
            reuseDocs[path] = data;
            delete pendingDocs[path];
    
            return data;
        }
    } catch (error) {
        console.log(error)
        console.error('Document read failed:', path)
    }
}

// TODO: Add an isolated document for user subscription data?
export function addUserAccount(data, user) {
    console.log('adduseraccount')

    const cData = Object.assign({schedulename: data.firstname}, data)

    return setDoc(
        doc(db, 'users/' + user.uid),
        {
            info: cData,
            orgs: {},
        }
    )
}

export async function getSubscriptions(org, email) {
    console.log('getsubscriptions')

    return await getData(org + '/chat/docs/' + email);
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
    return await getData('users/' + auth.currentUser.uid);
}

// TODO: look at this
export async function getRolesDoc(org, setDoc, setLoading, refresh) {
    console.log('getrolesdoc')

    setLoading(true)

    let data;
    if (await internalCheckAdmin(org)) {
        data = await getData(org + '/private/docs/roleKeys', refresh)
        // data = Object.keys(data).map((roleName) => Object.assign(data[roleName], {roleName: roleName}))
    } else {
        data = await getData(org + '/public/docs/roles', refresh);
        data = Object.keys(data).map((roleName) => Object.assign(data[roleName], {roleKey: '#######'}))
    }

    setDoc(data);
    setLoading(false)
}

export async function getPeople(org, setPeople) {
    console.log('getpeople')

    const people = await getData(org + '/chat');

    let adaptedPeople = {};
    for (let i in people) {
        adaptedPeople[people[i].fullname] = Object.assign(people[i], {email: i})
    }

    setPeople(adaptedPeople)
}

async function internalCheckAdmin(org) {
    const email = auth.currentUser.email;
    const data = await getData(org + '/public/users/' + email);
    return data.admin;
    
}


export async function checkAdmin(org, setIsAdmin) {
    console.log('checkadmin')

    try {
        setIsAdmin(await internalCheckAdmin(org))
    } catch (error) {
        console.log('Error:')
        console.error(error.message)
        setIsAdmin(false)
    }
}

export async function getMemo(org, setTitle, setPerson, setContents) {
    console.log('getmemo')

    const data = await getData(org + '/public');

    setTitle(data.title)
    setPerson(data.person)
    setContents(data.contents)
}

export function setMemo(org, title, contents) {
    console.log('setmemo')

    return setDoc(
        doc(db, org + '/public'),
        {
            title: title,
            contents: contents,
            person: auth.currentUser.displayName
        }
    )
}

export function saveSchedule(org, title, data) {
    console.log('saveschedule')

    const description = (data) => (
        (data.avDate
        ?
        `Availability Due: ${new Date(data.avDate).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})}\n`
        :
        '')
        +
        (data.timestamp
        ?
        `Last Edited: ${new Date(data.timestamp).toLocaleString('en-US', {timeStyle: 'short', dateStyle: 'medium'})}`
        :
        '')
    )

    const batch = writeBatch(db);


    batch.set(doc(db, org + '/agenda/schedules/' + title), data, {merge: true})
    batch.set(doc(db, org + '/agenda'), {[title]: {title: title, description: description(data), subtitle: data.type }}, {merge: true})

    return batch.commit();
}

export function saveAvailability(org, schedule, data) {
    console.log('saveavailability')

    console.log('dat', data)

    reuseDocs[org + '/agenda/availability/' + auth.currentUser.email] = undefined;

    console.log('writing', org + '/agenda/availability/' + auth.currentUser.email)

    return setDoc(
        doc(db, org + '/agenda/availability/' + auth.currentUser.email),
        {[schedule]: data},
        {merge: true}
    )
}

export async function getAvailability(org, schedule, setAvailability) {
    const data = await getData(org + '/agenda/availability/' + auth.currentUser.email)
    setAvailability(data[schedule])
}

export async function getAllAvs(org, setAllAvs) {
    if (allAvs) {
        setAllAvs(allAvs)
    } else {
        allAvs = {};
        const q = query(collection(db, org + '/agenda/availability/'));
        const snap = await getDocs(q);
        snap.forEach(item => {allAvs[item.id] = item.data()})
        setAllAvs(allAvs)
    }
}

export async function getSchedule(org, title) {
    console.log('getschedule')

    const data = await getData(org + '/agenda/schedules/' + title);

    return data;
}

export async function getAllSchedules(org, setContents) {
    console.log('getallschedules')

    const data = await getData(org + '/agenda');
    
    if (data) {
        setContents(
            Object.keys(data).map((key) => ({
                org: org,
                ...data[key]
            }))
        )
    }

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
export function accessImage(location, setURL, refresh) {
    if (imageURLs[location] && !refresh) {
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
    if (orgFiles[path]) {
        setFiles(orgFiles[path])
    } else {
        const listRef = ref(storage, path);
    
        // Find all the prefixes and items.
        const res = await listAll(listRef);
        orgFiles[path] = res.items;
        setFiles(res.items);
    }
}