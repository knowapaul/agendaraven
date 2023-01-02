const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Add subscription data to user or organziation
/**
 * @param  {Map} data provide: orgName, phonenumber, schedulename
 * @param  {Map} context (provided by default)
 */
exports.createOrganization = functions.https.onCall(async (data, context) => {
    const orgName = data.orgName;
    const orgIndex = 'index';
    const orgChat = orgName + 'chat'
    const orgData = orgName + 'data'

    const orgRef = db.collection(orgIndex).doc('organizations');

    const uid = context.auth.uid;
    const name = await auth.getUser(uid);
    const picture = context.auth.token.picture;
    const email = context.auth.token.email;

    const chatRef = db.collection(orgChat).doc()

    const docSnap = await db.collection('index').doc('organizations').get()

    // Double check to make sure the organization name is not forbidden 
    // TODO: also do this in the front end code

    if (Object.keys(docSnap.data()).includes(data.orgName)) {
        // throw new functions.https.HttpsError('invalid-name', 'This organization name is not available.')
        return 'Sorry, that organization name is not available.'
    }

    // Add the organization to the forbidden list
    await orgRef.set({[data.orgName]: true}, { merge: true})

    // Create an org subscription file
    // TODO: add any other relevant fields
    await db.collection(orgData)
            .doc('subscription')
            .set({ canAdd: true, userLimit: 20, })

    await join(orgName, 'owner', uid, email, name.displayName, data.phonenumber, data.schedulename)


    // Create the org memo
    const dataRef = db.doc(org + 'data/memo');
    await dataRef.set({
        title: 'Welcome!', 
        person: 'AgendaRaven', 
        contents: 'You can use this widget to make announcements to your organization.'
    })


    // Send a welcome message to the owner
    await sendChatMessage(
            orgName, 
            'AgendaRaven', 
            'Welcome to your new organization! Go to settings and add other users to get started.', 
            [email]
            )

    return false;
    // .catch((error) => {
    //     throw new functions.https.HttpsError('The follwing error occured', error.message);
    // })
});

// Manage the database manipulation necessary to send and receive chat messages
// TODO: Add user inteface capability to detect if a potential new chat already exists
async function sendChatMessage(orgName, sender, body, recipients, oldChat) {
    const timestamp = new Date().toString();
    const chatCol = orgName + 'chat';
    const message = {sender: sender, body: body, timestamp: timestamp}

    const userDoc = await db.collection(chatCol).doc('index').get()
    const users = userDoc.data()
    if (oldChat) {
        const oldRef = db.doc(oldChat)
        let currentChat = (await oldRef.get()).data()
        functions.logger.info('currentchat', currentChat)
        return await oldRef.set({ 
            messages: currentChat.messages.concat(message)
            }, {merge: true}
        )
    } else {
        let subscribers = recipients;
        const newDoc = db.collection(chatCol).doc();

        subscribers = subscribers.concat(sender)

        // Create the chat specific document
        await newDoc.set({ 
            subscribers: subscribers,
            messages: [message]
            }, {merge: true}
        )

        // Set the recipients' subscription
        for (i in recipients) {
            return await db.collection(chatCol)
                .doc(users[recipients[i]].uid)
                .set({ 
                    [newDoc.path]: subscribers
                }, {merge: true})
        }
    }
}
// data.orgName, data.body, data.recipients, data.oldChat
exports.sendChatMessage = functions.https.onCall((data, context) => {
    return sendChatMessage(data.orgName, context.auth.token.email, data.body, data.recipients, data.oldChat)
})

// Run joins for new owners and normal users
async function join(orgName, role, uid, email, displayName, phonenumber, schedulename) {
    const orgUsers = orgName + 'users';
    const orgData = orgName + 'data';
    const orgChat = orgName + 'chat';
    const userDoc = db.collection('users').doc(uid)

    // Add to user account
    const orgs = (await userDoc.get()).data().orgs;
    await userDoc.set({ orgs: Object.assign(orgs, {[orgName]: true}) }, {merge: true})

    // Add to roles
    await db.collection(orgUsers)
        .doc('roles')
        .set({ [uid]: [role] }, {merge: true})

    // Add to org user data
    await db.collection(orgData)
        .doc('userData')
        .set({ 
            [uid]: { 
                phonenumber: phonenumber, 
                schedulename: schedulename 
            } 
        }, {merge: true})

    // Add to chat address book
    // TODO: add user access rules
    await db.collection(orgChat)
            .doc('index')
            .set({ 
                [email]: { 
                    uid: uid, 
                    schedulename: schedulename,
                    fullname: displayName,
                    roles: [role]
                } 
            }, {merge: true})
        
    //     // Add to
    //     return db.collection(orgChat)
    //     .doc(uid)
    //     .set({ 
    //         [request.auth.email]: { 
    //             uid: uid, 
    //             schedulename: data.schedulename 
    //         } 
    //     }, {merge: true})
}

// Runs join with ordinary user parameters
exports.joinOrganization = functions.https.onCall(async (data, context) => {
    functions.logger.log('data' , data)

    const uid = context.auth.uid;
    const name = await auth.getUser(uid);
    const email = context.auth.token.email;

    const doc = await db.collection(data.orgName + 'data')
                .doc('roles')
                .get()

    functions.logger.log('name', name.displayName)
    functions.logger.log('roles', doc.data())

    const role = doc.data()[data.joinCode].roleName;

    await join(data.orgName, role, uid, email, name.displayName, data.phonenumber, data.schedulename)
    
    // Send welcome message
    const messageBody = `Congratulations on joining ${data.orgName}! For information from your organization's owner, visit the home page, or for insights on how to use AgendaRaven, visit the 'Insights' tab.`
    await sendChatMessage(data.orgName, 'AgendaRaven', messageBody, [email])
});

// TODO: Add a role to an organization


async function addRole(org, roleName, roleKey, roleDescription) {
    const doc = await db.collection(org + 'data')
        .doc('roles')
        .set({
            [roleKey]: {
                roleName: roleName,
                roleDescription: roleDescription,
            }
        }, {merge: true})
}

exports.addRole = functions.https.onCall(async (data, context) => {
    // TODO: Check user admin status
    // const uid = context.auth.uid;
    // const name = context.auth.token.name || null;
    // const email = context.auth.token.email || null;

    await addRole(data.orgName, data.roleName, data.roleKey, data.roleDescription)
    
    return true
});