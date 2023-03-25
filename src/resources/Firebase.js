// Firebase Resources
import { collection, doc, getDoc, setDoc, getDocs, query, writeBatch, deleteDoc } from "firebase/firestore"; 
import { ref, getDownloadURL, uploadBytes, listAll } from "firebase/storage"; 

import { getAuth, connectAuthEmulator, updateProfile, sendPasswordResetEmail, updatePassword, createUserWithEmailAndPassword, reauthenticateWithCredential, confirmPasswordReset, signInWithEmailAndPassword } from "firebase/auth";
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


// ---------- GLOBALS ----------
/**
 * ## Refresh All Firebase Resources
 * 
 * Refresh documents read, images read, and files read
 */
function fullRefresh() {
    console.log('REFRESHING...', reuseDocs, pendingDocs)
    reuseDocs = {};
    pendingDocs = {};
    imageURLs = {};
    orgFiles = {};
    allAvs = undefined;
}

/**
 * ## Initialize an Firebase instance of the given app
 * @param {FirebaseApp} app 
 */
export function setApp(app) {
    auth = getAuth(app);
    connectAuthEmulator(auth, "http://localhost:9099")
    db = getFirestore(app);
    connectFirestoreEmulator(db, 'localhost', 8080);
    functions = getFunctions(app);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    storage = getStorage(app);
    connectStorageEmulator(storage, 'localhost', 9199);
    perf = getPerformance(app);
    console.log('perf', perf)


// if (window.confirm('Do you want to restore the database?') === true) {
//     restoreDb()
// }

}

/**
 * ## Get the current Firebase services
 * ! May become deprecated. All firebase actions should take place in this file.
 * @returns the current instance of all Firebase services: auth, db, functions, and storage
 */
export function getFirebase() {
    return {
        auth: auth,
        db: db,
        functions: functions,
        storage: storage
    }
}

/** 
 * ## Wipes all saved document data and forces a refresh.
 */
export function reloadAllDocs() {
    reuseDocs = {};
    pendingDocs = {};
}

// -------- ACCOUNT HANDLING ----------
/**
 * ## Create a new account 
 * @param {Map} inData the user's phonenumber and schedulename fields
 * @param {Function} navigate the function to call to navigate to another page (created with useNavigate())
 * @param {Function} setError the function to call to set any resulting errors 
 * TODO: Remove stateful calls from all functions in this file for better usage in differing contexts
 */
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

// // TODO: Add an isolated document for user subscription data?
/**
 * ## Add a user's account to the database
 * @param {Object} data the user's info fields
 * @param {FirebaseUser} user the user object of the user
 * @returns a promise resolved with the result of the set 
 */
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

/**
 * ## Login a user with their email and password
 * @param {String} email the user's email
 * @param {String} password the user's password
 * @returns a promise resolved with the result of the signin
 */
export function handleLogin(email, password) {
    fullRefresh()
    return signInWithEmailAndPassword(auth, email, password)
}

/**
 * ## Send a password reset email to the given email address
 * @param {String} email the user's email address
 * @returns a promise resolved with the result of the email
 */
export function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email)
}

/**
 * ## Reset the user's password with an emailed reset code
 * @param {String} oobCode the oob code sent in a password reset email
 * @param {String} newPassword the user's new password
 * @returns a promise that resolves with the result of the password reset
 */
export function resetPassword(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword)
}

/**
 * ## Update a user's profile
 * @param {Map} data The fields to update
 * @returns a promise which resolves with the result of the profile update
 */
export function handleProfileUpdate(data)  {
    return updateProfile(auth.currentUser, data);
}

/**
 * ## Update a user's password using their old password
 * 
 * TODO: Make this work
 * @param {String} oldPassword the user's old password
 * @param {String} newPassword the user's new password
 * @returns a promise resolved with the result of the password update
 */
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

// ---------- AUTH FUNCTIONS ----------
/**
 * ## Check if the user is an admin
 * TODO: This will eventually replace the checkAdmin function
 * @param {String} org the organization name to check if the user is an admin inj
 * @returns true if the user is an admin, false if they are another member, and undefined if they are not even a member
 */
export async function internalCheckAdmin(org) {
    const data = await getData(org + '/public/users/' + auth.currentUser.uid);
    return data.admin;
}

/**
 * ## Internal check admin with a state call
 * ! This behavior will eventually become deprecated
 * @param {*} org string
 * @param {Function} setIsAdmin the set function
 */
export async function checkAdmin(org, setIsAdmin) {
    try {
        setIsAdmin(await internalCheckAdmin(org))
    } catch (error) {
        console.log('Error:')
        console.error(error.message)
        setIsAdmin(false)
    }
}

// ---------- FIRESTORE LOGIC FUNCTIONS --------
/**
 * ## Cleanly and efficiently get a Firestore document's data
 * @param {String} path the Firestore path of the document to be read
 * @param {Boolean} refresh set to true to force the read to come from Firebase and not from previously read data
 * @returns a promise resolved with the requested data
 */
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
            console.log('getData', path)
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


// ---------- READ FUNCTIONS ----------
export async function getSubscriptions(org, uid) {
    return await getData(org + '/chat/docs/' + uid);
}

export async function getUserData() {
    return await getData('users/' + auth.currentUser.uid);
}

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
}

export async function getMemo(org, setTitle, setPerson, setContents) {
    const data = await getData(org + '/public');

    setTitle(data.title)
    setPerson(data.person)
    setContents(data.contents)
}

export async function getAvailability(org, schedule, setAvailability) {
    const data = await getData(org + '/agenda/availability/' + auth.currentUser.uid)
    if (data) {
        setAvailability(data[schedule] || {})
    }
}

export async function getAllAvs(org, setAllAvs, refresh) {
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

async function refreshScheduleIndex(org) {
    console.log('reuse,pending', reuseDocs, pendingDocs)
    reuseDocs[org + '/agenda'] = undefined;
    pendingDocs[org + '/agenda'] = undefined;
}

export async function getSchedule(org, title, unpublished, refresh) {
    const data = await getData(org + `/agenda/${unpublished ? 'unpublished' : 'schedules'}/` + title, refresh);
    return data;
}

export async function getArchivedSchedules(org) {
    const data = await getData(org + `/agenda/archives/==index-file==`);
    return data;
}


// ---------- WRITE FUNCTIONS ----------
/**
 * ## Set an organization's memo
 * @param {String} org the organization of the memo being set
 * @param {String} title the title of the memo
 * @param {String} contents the contents of the memo
 * @returns a promise resolved with the result of the set
 */
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

/**
 * ## Save a user's availability to the database
 * @param {String} org the current organization
 * @param {String} schedule the schedule the availability is for
 * @param {Object} data the availability fields
 * @param {String} otherUser the uid of another user to set the availability for (admin only)
 * @returns a promise resolved with the result of the set
 */
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

/**
 * ## Save a schedule to the database (admin only)
 * @param {} org the current organization 
 * @param {String} title the schedule's title
 * @param {Object} data the schedules's data
 * @param {Boolean} published whether the schedule is publicly visible to members
 * @returns a promise resolved with the result of the batch commit
 */
export async function saveSchedule(org, title, data, location) {
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

    const prev = await getData(org + '/agenda', true);

    if (location === 'archive') {
        console.log('location === archive')
        // Move to archive
        if (title === '__index-file__') {
            throw Error('Bad file name (==index-file==)')
        }

        batch.set(doc(db, org + `/agenda/archives/` + title), data)
        batch.set(doc(db, org + `/agenda/archives/==index-file==`), {[title]: {type: data.type, timestamp: data.timestamp}}, {merge: true})

        batch.delete(doc(db, org + `/agenda/schedules/` + title))
        batch.delete(doc(db, org + `/agenda/unpublished/` + title))
        
        let temp = prev
        delete temp[title] 

        // Delete old reference to it
        batch.set(doc(db, org + '/agenda'), temp)
    } else {

        let wasPublished;
        if (prev[title]) {
            wasPublished = prev[title].published
        }

        if (location === 'publish') {
            batch.set(doc(db, org + `/agenda/schedules/` + title), data, {merge: true})
        }

        batch.set(doc(db, org + `/agenda/unpublished/` + title), data, {merge: true})
    
        batch.set(
            doc(db, org + '/agenda'), 
            {[title]: {
                title: title, 
                description: description(data), 
                subtitle: data.type, 
                published: Boolean(wasPublished || location === 'publish'), 
            }}, 
            {merge: true}
        )
    }

    refreshScheduleIndex(org)

    return await batch.commit();
}

async function removeArchiveIndex(org, title) {
    let temp = await getData(org + `/agenda/archives/==index-file==`);
    delete temp[title]
    
    setDoc(doc(db, org + `/agenda/archives/==index-file==`), temp)
}

export async function unArchive(org, title) {
    const data = await getData(org + `/agenda/archives/` + title);

    await removeArchiveIndex(org, title)

    deleteDoc(doc(db, org + `/agenda/archives/` + title))

    refreshScheduleIndex(org)
    reuseDocs[org + `/agenda/archives/==index-file==`] = undefined
    pendingDocs[org + `/agenda/archives/==index-file==`] = undefined
    

    return saveSchedule(org, title, data);
}

export async function deleteSchedule(org, title) {
    await removeArchiveIndex(org, title)

    refreshScheduleIndex(org)

    return deleteDoc(doc(db, org + `/agenda/archives/` + title));
}


// ---------- STORAGE ----------
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

export async function uploadFile(file, path) {
    const storageRef = ref(storage, path);

    orgFiles[path] = undefined

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

// --------- DEPRECATED FUNCTIONS ----------

// export async function getChatMessaging(location, setMessages) {
//     // console.log('getchatmessaging')

//     // const unsub = onSnapshot(doc(db, location), (doc) => {
//     //     setMessages(doc.data())
//     // });
//     // return unsub;
// }

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