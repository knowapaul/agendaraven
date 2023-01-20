// Firebase Resources
import { collection, doc, getDoc, setDoc, getDocs, query, writeBatch } from "firebase/firestore"; 
import { ref, getDownloadURL, uploadBytes, listAll } from "firebase/storage"; 

import { getAuth, connectAuthEmulator, updateProfile, sendPasswordResetEmail, updatePassword, createUserWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";


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

export function handleProfileUpdate(data)  {
    return updateProfile(auth.currentUser, data);
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
    console.log('done getpeople')
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

export function saveAvailability(org, schedule, data, otherUser) {
    console.log('saveavailability')

    console.log('dat', data)

    const writeEmail = otherUser || auth.currentUser.email;

    reuseDocs[org + '/agenda/availability/' + writeEmail] = undefined;

    console.log('writing', org + '/agenda/availability/' + writeEmail)

    return setDoc(
        doc(db, org + '/agenda/availability/' + writeEmail),
        {[schedule]: data},
        {merge: true}
    )
}

export async function getAvailability(org, schedule, setAvailability) {
    const data = await getData(org + '/agenda/availability/' + auth.currentUser.email)
    setAvailability(data[schedule])
}

export async function getAllAvs(org, setAllAvs, refresh) {
    console.log('getallavs')
    if (allAvs && !refresh) {
        setAllAvs(allAvs)
    } else {
        allAvs = {};
        const q = query(collection(db, org + '/agenda/availability/'));
        const snap = await getDocs(q);
        snap.forEach(item => {allAvs[item.id] = item.data()})
        setAllAvs(allAvs)
    }
}

export function saveSchedule(org, title, data, published) {
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
    if (published) {
        batch.set(doc(db, org + '/agenda'), {[title]: {title: title, description: description(data), subtitle: data.type }}, {merge: true})
    }

    return batch.commit();
}

export async function getSchedule(org, title, unpublished, refresh) {
    console.log('getschedule')

    const data = await getData(org + `/agenda/${unpublished ? 'unpublished' : 'schedules'}/` + title, refresh);

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