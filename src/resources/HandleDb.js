import { collection, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"; 

// TODO: Add an isolated document for user subscription data?
export function addUserAccount(db, data, user) {
    const users = collection(db, 'users')

    const cData = Object.assign({schedulename: data.firstname}, data)

    return setDoc(
        doc(users, user.uid),
        {
            info: cData,
            orgs: [],
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