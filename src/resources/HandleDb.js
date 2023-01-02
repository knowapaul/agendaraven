// Firebase Resources
import { collection, doc, getDoc, setDoc, onSnapshot, getDocs, Query, query, QuerySnapshot, namedQuery } from "firebase/firestore"; 

// TODO: Add an isolated document for user subscription data?
export function addUserAccount(db, data, user) {
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
export async function getSubscriptions(db, org, uid) {
    const chat = doc(db, `${org}chat`, uid)
    const docSnap = await getDoc(chat)
    return docSnap.data();
}

export async function getChatMessaging(db, location, setMessages) {
    const unsub = onSnapshot(doc(db, location), (doc) => {
        setMessages(doc.data())
    });
    return unsub;
}

export async function getUserData(db, uid) {
    const users = collection(db, 'users')
    const data = (await getDoc(doc(users, uid))).data()
    return data;
}

export async function initDatabase(db) {
    const orgs = doc(db, 'index/organizations')
    const orgDocSnap = await getDoc(orgs)
    if (!orgDocSnap.exists()) {
        // Set invalid organization names
        setDoc(
            orgs,
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

export function getRolesDoc(db, org) {
    const orgData = collection(db, org + 'data')
    return doc(orgData, 'roles');
}

export async function getPeople(db, org, setPeople) {
    const orgData = collection(db, org + 'chat')
    const docSnap = await getDoc(doc(orgData, 'index'));
    const people = docSnap.data();


    let adaptedPeople = {};
    for (let i in people) {
        adaptedPeople[people[i].fullname] = Object.assign(people[i], {email: i})
    }

    // console.log('adap', adaptedPeople)

    setPeople(adaptedPeople)
}

export async function checkAdmin(db, org, uid, setIsAdmin) {
    const orgUsers = collection(db, org + 'users')
    const docSnap = await getDoc(doc(orgUsers, 'roles'));
    const data = docSnap.data();

    console.log('data', data)

    try {
        setIsAdmin(data[uid].includes('owner'))
    } catch (error) {
        console.log('Error:')
        console.error(error.message)
        setIsAdmin(false)
    }
}

export async function getMemo(db, org, setTitle, setPerson, setContents) {
    const orgData = collection(db, org + 'data')
    const docSnap = await getDoc(doc(orgData, 'memo'));
    const data = docSnap.data();
    setTitle(data.title)
    setPerson(data.person)
    setContents(data.contents)
}

export function setMemo(db, org, title, contents, user) {
    const orgData = collection(db, org + 'data')

    return setDoc(
        doc(orgData, 'memo'),
        {
            title: title,
            contents: contents,
            person: user.displayName
        }
    )
}

// TODO: Make this secure with rules
export function saveSchedule(db, org, title, type, fields, contents) {
    const orgSch = collection(db, org + 'schedules')

    let ol = []
    for (let i in contents) {
        if (contents[i] !== {}) {
            ol = ol.concat(contents[i])
        }
    }

    return setDoc(
        doc(orgSch, title),
        {
            title: title,
            type: type,
            fields: fields,
            contents: ol,
            timestamp: new Date().toString()
        }
    )
}


export async function getSchedule(db, org, title, setTitle, setType, setFields, setContents) {
    const orgSch = collection(db, org + 'schedules')
    const docSnap = await getDoc(doc(orgSch, title))
    const data = docSnap.data();

    setTitle(data.title)
    setType(data.type)
    setFields(data.fields)
    setContents(data.contents)
}

export async function getAllSchedules(db, org, setContents, setSchedule) {
    const snaps = await getDocs(collection(db, org + "schedules"));


    setContents(
        snaps.docs.map((snap) => ({
            title: snap.data().title,
            description: snap.data().type,
            subtitle: new Date(snap.data().timestamp).toLocaleString(),
            fields: snap.data().fields,
            contents: snap.data().contents,
            org: org,
            setSchedule: setSchedule,
        }))
    )
}
