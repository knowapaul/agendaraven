// Firebase Resources
import { collection, doc, getDoc, setDoc, getDocs, query, writeBatch } from "firebase/firestore"; 
import { ref, getDownloadURL, uploadBytes, listAll } from "firebase/storage"; 

import { getAuth, connectAuthEmulator, updateProfile, sendPasswordResetEmail, updatePassword, createUserWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider, confirmPasswordReset, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getPerformance } from "firebase/performance";



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
let perf;

function fullRefresh() {
    console.log('REFRESHING...', reuseDocs, pendingDocs)
    reuseDocs = {};
    pendingDocs = {};
    imageURLs = {};
    orgFiles = {};
    allAvs = undefined;
}

export function setApp(app) {
    auth = getAuth(app);
    connectAuthEmulator(auth, "http://localhost:9099")
    db = getFirestore(app);
    connectFirestoreEmulator(db, 'localhost', 8080);
    functions = getFunctions(app);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    storage = getStorage(app);
    connectStorageEmulator(storage, 'localhost', 9199);
    // perf = getPerformance(app);
    // console.log('perf', perf)


// if (window.confirm('Do you want to restore the database?') === true) {
//     restoreDb()
// }

}

/** Wipes all saved document data and forces a refresh.
 */
export function reloadAllDocs() {
    reuseDocs = {};
    pendingDocs = {};
}

export function handleProfileUpdate(data)  {
    return updateProfile(auth.currentUser, data);
}

export function ForgotPassword(email) {
    return sendPasswordResetEmail(auth, email)
}

export function resetPassword(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword)
}

export async function handleUpdatePassword(oldPassword, newPassword) {
    console.log('user', auth.currentUser)
    console.log('hut', auth, auth.EmailAuthProvider)
    const cred = auth.currentUser.auth.EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
    console.log('cred', cred)
    console.log('func')
    
    const result = await reauthenticateWithCredential(auth.currentUser, cred)
    console.log('result', result)
    return await updatePassword(auth.currentUser, newPassword)
}

export function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
}

export function handleLogin(email, password) {
    fullRefresh()
    return signInWithEmailAndPassword(auth, email, password)
}

export function createNewAccount(inData, navigate, setError) {
    let data = Object.assign({}, inData)
    createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCred) => {
            const displayName = data.firstname + ' ' + data.lastname;
            updateProfile(userCred.user, {displayName: displayName})
                .then(() => {
                    if (!data.schedulename) {
                        data.schedulename = data.firstname
                    }
                    
                    const acountInfo = {
                        schedulename: data.schedulename,
                        phonenumber: data.phonenumber
                    }
        
                    return addUserAccount(acountInfo, auth.currentUser)
                })
                .then(() => {
                    navigate('/dashboard')
                })
                .catch((error) => {
                    alert(`The following error occured while creating your account. 
                        It may affect the functionality of the site. ${error.message}`)
                })
        })
        .catch((error) => {
            setError(error.message)
        })
        
        
}

async function getData(path, refresh) {
    console.log('getData', path)
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
        throw error;
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
            email: user.email
        }
    )
}

export async function getSubscriptions(org, uid) {
    return await getData(org + '/chat/docs/' + uid);
}

export async function getChatMessaging(location, setMessages) {
    // console.log('getchatmessaging')

    // const unsub = onSnapshot(doc(db, location), (doc) => {
    //     setMessages(doc.data())
    // });
    // return unsub;
}

export async function getUserData() {
    return await getData('users/' + auth.currentUser.uid);
}

// TODO: look at this
export async function getRolesDoc(org, setDoc, setLoading, refresh) {
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
    const people = await getData(org + '/chat');

    let adaptedPeople = {};
    for (let i in people) {
        adaptedPeople[people[i].fullname] = Object.assign(people[i], {uid: i})
    }

    setPeople(adaptedPeople)
    console.log('done getpeople')
}

export async function internalCheckAdmin(org) {
    const data = await getData(org + '/public/users/' + auth.currentUser.uid);
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

export function saveAvailability(org, schedule, data, otherUser) {
    console.log('saveavailability')
    
    const writeTo = otherUser || auth.currentUser.uid;

    reuseDocs[org + '/agenda/availability/' + writeTo] = undefined;

    console.log('writing', org + '/agenda/availability/' + writeTo)

    return setDoc(
        doc(db, org + '/agenda/availability/' + writeTo),
        {[schedule]: data},
        {merge: true}
    )
}

export async function getAvailability(org, schedule, setAvailability) {
    const data = await getData(org + '/agenda/availability/' + auth.currentUser.uid)
    setAvailability(data[schedule] || {})
}

export async function getAllAvs(org, setAllAvs, refresh) {
    if (allAvs && !refresh) {
        setAllAvs(allAvs)
    } else {
        allAvs = {};
        const q = query(collection(db, org + '/agenda/availability/'));
        const snap = await getDocs(q);
        console.log('snap', snap)
        snap.forEach(item => {allAvs[item.id] = item.data(); console.log('dat', item.data())})
        setAllAvs(allAvs)
    }
}

export async function saveSchedule(org, title, data, published) {
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

    console.log('address', org + `/agenda/${published ? 'schedules' : 'unpublished'}/` + title)

    batch.set(doc(db, org + `/agenda/${published ? 'schedules' : 'unpublished'}/` + title), data, {merge: true})

    const prev = getData(org + '/agenda', true);

    let wasPublished;
    if (prev[title]) {
        wasPublished = prev[title][published]
    }

    batch.set(doc(db, org + '/agenda'), {[title]: {title: title, description: description(data), subtitle: data.type, published: Boolean(wasPublished || published), }}, {merge: true})

    return batch.commit();
}

export async function getSchedule(org, title, unpublished, refresh) {
    const data = await getData(org + `/agenda/${unpublished ? 'unpublished' : 'schedules'}/` + title, refresh);

    return data;
}

export async function getAllSchedules(org, setContents) {
    const data = await getData(org + '/agenda');
    
    if (data) {
        setContents(
            Object.keys(data).map((key) => ({
                org: org,
                ...data[key]
            }))
        )
    }
    console.log('done with getschedules')

}

// ! May become deprecated. All firebase actions should take place in this file.
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

// async function restoreDb() {
//     const org = 'SJYSA Refs';

//     const inOrg = (await getDoc(doc(db, org + '/private/docs/userData'))).data()
//     const oldChatDoc = (await getDoc(doc(db, org + '/chat'))).data()
//     console.log('inorg', inOrg)

//     const q = query(collection(db, 'users'));
//     const users = await getDocs(q);
//     console.log('users', users)
    
//     let newUserDoc = {};
//     let newChatDoc = {};

//     Object.keys(inOrg).forEach((oldEmail) => {
//         users.docs.forEach(async (u) => {
//             if (inOrg[oldEmail].schedulename === u.data().info.schedulename) {
//                 console.log('match!', inOrg[oldEmail].schedulename, u.data().info.schedulename, u.data())
//                 console.log('uid', u.id)
//                 newUserDoc[u.id] = Object.assign(inOrg[oldEmail], {email: oldEmail})

//                 newChatDoc[u.id] = oldChatDoc[oldEmail]

//                 const oldAvailability = (await getDoc(doc(db, org + '/agenda/availability/' + oldEmail))).data()
//                 console.log('old', oldAvailability)

//                 if (oldAvailability) {
//                     setDoc(doc(db, org + '/agenda/availability/' + u.id), oldAvailability, {merge: true})
//                 }

//                 const oldUserDoc = (await getDoc(doc(db, org + '/public/users/' + oldEmail))).data()

//                 setDoc(doc(db, org + '/public/users/' + u.id), oldUserDoc, {merge: true})


//                 // TODO: Pickup database recondtioning here
//                 // setDoc(doc.ref, {hi: true}, {merge: true})
//             }
//         })
//     })

//     // // TODO: Public/users

//     // // TODO: chat

//     // // TODO: Availability

//     setDoc(doc(db, org + '/private/docs/userData'), newUserDoc, {merge: true})
//     setDoc(doc(db, org + '/chat'), newChatDoc, {merge: true})

//     console.log('done!', newUserDoc)
    
//     return true
// }

