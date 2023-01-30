const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
functions.logger.log('db', db)
const auth = admin.auth();

const twilio = require('twilio');

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
    try {
        
        // Shorten frequently used values
        const orgName = data.orgName;
        
        const uid = context.auth.uid;
        const name = await auth.getUser(uid);
        // const picture = context.auth.token.picture;
    
        const forbidden = [ 'dashboard', 'about', 'logout', 'createaccount', 'loading', ]
    
        functions.logger.log('db', db)
        functions.logger.log('passed-1...')
        // Document references
        const orgRef = db.doc('index/organizations');
        functions.logger.log('string...')
        const dataRef = db.doc(orgName + '/public');
        const subRef = db.doc(orgName + '/private');
    
        functions.logger.log('passed0...')
        // Create the organization in a transaction to ensure that everything works as intended.
        const response = await db.runTransaction(async (transaction) => {
            functions.logger.log('passed1.2')
            // Read ------------------------------
            // Double check to make sure the organization name is not forbidden 
            // TODO: also do this in the front end code
            const orgSnap = await transaction.get(orgRef);
            const currentOrgs = orgSnap.data() ? Object.keys(orgSnap.data()) : [];
            functions.logger.log('passed1...')
            if (currentOrgs.concat(forbidden).includes(data.orgName)) {
                throw new Error('Sorry, that organization name is not available.');
            }
    
            // Write -----------------------------
            // Add the organization to the forbidden list
            transaction.set(orgRef, {[data.orgName]: true}, { merge: true })
    
            functions.logger.log('passed...')
            // Create an org subscription file
            // TODO: add any other relevant fields
            transaction.set(subRef, { canAdd: true, userLimit: 20, })
    
            // Create the org memo
            transaction.set(dataRef, {
                title: 'Welcome!', 
                person: 'AgendaRaven', 
                contents: 'You can use this widget to make announcements to your organization.'
            })
    
            // Add the user to their own organization
            await join(orgName, transaction, 'owner', uid, name.displayName, data.phonenumber, data.schedulename)
        });
        
        // Send a welcome message to the owner
        // await sendChatMessage(
        //     orgName, 
        //     'AgendaRaven', 
        //     'Welcome to your new organization! Go to settings and add other users to get started.', 
        //     [email]
        //     )
        
        return;
    } catch ( error ) {
        functions.logger.log('AN ERROR Occurred!', error)
        return {error: error};
    }
});

// Manage the database manipulation necessary to send and receive chat messages
// TODO: Add user inteface capability to detect if a potential new chat already exists
async function sendChatMessage(orgName, sender, body, recipients, oldChat) {
    // try {
    //     functions.logger.log('chatmessage')
    //     const timestamp = new Date().toString();
    //     const chatDoc = orgName + '/chat';
    //     const message = {sender: sender, body: body, timestamp: timestamp}
    
    //     // The chat doc contains the users' address documents
    //     const userDoc = await db.doc(chatDoc).get()
    //     const users = userDoc.data()
    //     if (oldChat) {
    //         const oldRef = db.doc(oldChat)
    //         let currentChat = (await oldRef.get()).data()
    //         functions.logger.info('currentchat', currentChat)
    //         return await oldRef.set({ 
    //             messages: currentChat.messages.concat(message)
    //             }, {merge: true}
    //         )
    //     } else {
    //         let subscribers = recipients;
    //         const newDoc = db.collection(chatDoc + '/docs/').doc();
    
    //         subscribers = subscribers.concat(sender)
    
    //         // Create the chat specific document
    //         await newDoc.set({ 
    //             subscribers: subscribers,
    //             messages: [message]
    //             }, {merge: true}
    //         )
    
    //         // Set the recipients' subscription
    //         for (i in recipients) {
    //             return await db.doc(chatDoc + '/docs/' + users[recipients[i]].email)
    //                 .set({ 
    //                     [newDoc.path]: subscribers
    //                 }, {merge: true})
    //         }
    //     }
    //     return;
    // } catch (error) {
    //     return error
    // }
}
// data.orgName, data.body, data.recipients, data.oldChat

exports.sendChatMessage = functions.https.onCall((data, context) => {
    functions.logger.log('sendchatmessage', data, context)
//     return sendChatMessage(data.orgName, context.auth.token.email, data.body, data.recipients, data.oldChat)
})

// Run joins for new owners and normal users
async function join(orgName, transaction, role, uid, displayName, schedulename) {
    const userDoc = db.doc('users/' + uid)

    // Add to user account
    const orgs = (await userDoc.get()).data().orgs;
    transaction.set(userDoc, { orgs: Object.assign(orgs, {[orgName]: true}) }, {merge: true})

    // Add to roles
    transaction.set(db.doc(orgName + `/public/users/${uid}`), { admin: role === 'owner' || role.toLowerCase() === 'admin', roles: [role] }, {merge: true})

    // Add to org user data
    transaction.set(db.doc(orgName + '/private/docs/userData'),
        { 
            [uid]: { 
                schedulename: schedulename, 
            }
        }, {merge: true})

    // Add to chat address book
    // TODO: add user access rules
    transaction.set(db.doc(orgName + '/chat')
            ,{ 
                [uid]: { 
                    schedulename: schedulename,
                    fullname: displayName,
                    roles: [role]
                } 
            }, {merge: true});
}

// Runs join with ordinary user parameters
exports.joinOrganization = functions.https.onCall(async (data, context) => {
    try {
        functions.logger.log('data' , data)
    
        const uid = context.auth.uid;
        const name = await auth.getUser(uid);
    
        const response = await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(db.doc(data.orgName + '/private/docs/roleKeys'))

            if (!doc.data()) {
                throw new Error('That organization does not exist. Please double-check your spelling and keep in mind that names are case sensitive.');
            }
    
            const role = doc.data()[data.joinCode];
    
            if (!role) {
                throw new Error('Sorry, that join code is incorrect for this organization.');
            }
    
            await join(data.orgName, transaction, role.roleName, uid, name.displayName, data.schedulename)
        })
        functions.logger.log(response)
        return;
    } catch ( error ) {
        functions.logger.log('AN ERROR Occurred!', error)
        return {error: error.message};
    }
    // if (response) {
    //     return response;
    // }

    // functions.logger.log('name', name.displayName)
    // functions.logger.log('roles', doc.data())
    
    // Send welcome message
    // const messageBody = `Congratulations on joining ${data.orgName}! For information from your organization's owner, visit the home page, or for insights on how to use AgendaRaven, visit the 'Insights' tab.`
    // await sendChatMessage(data.orgName, 'AgendaRaven', messageBody, [email])

    // return response;
});

// TODO: Make this secure
async function addRole(org, roleName, roleKey, roleDescription) {
    const private = db.doc(org + '/private/docs/roleKeys');
    const public = db.doc(org + '/public/docs/roles');
    const response = db.runTransaction(async (transaction) => {
        const data = (await transaction.get(public)).data()
        if (data ? Object.keys(data).includes(roleName) : false) {
            throw new Error('That role name is already being used.');
        }
        transaction.set(private, {
                [roleKey]: {
                    roleKey: roleKey,
                    roleDescription: roleDescription,
                    roleName: roleName
                }
            }, {merge: true})
    
        transaction.set(public, {
                [roleName]: {
                    roleName: roleName,
                    roleDescription: roleDescription,
                }
            }, {merge: true})
    });
    return;
}

exports.addRole = functions.https.onCall(async (data, context) => {
    // TODO: Check user admin status
    // const uid = context.auth.uid;
    // const name = context.auth.token.name || null;

    try {
        if (!(await isAdmin(data.orgName, context.auth.uid))) {
            return 'Sorry, only authorized users may perform this action.';
        }
        await addRole(data.orgName, data.roleName, data.roleKey, data.roleDescription)

        return;
    } catch ( error ) {
        functions.logger.log('AN ERROR Occurred!', error)
        return {error: error};
    }

    
});

async function isAdmin(org, uid) {
    const snap = await db.doc(`${org}/public/users/${uid}`).get();
    return snap.data().admin
}   




// ----------- TWILIO --------------

function isE164(string) {
    return /^\+?[1-9]\d{1,14}$/.test(string)
}

function sendTwilioMessage(client, twilioNumber, recipient, body) {
    functions.logger.log('recipient', recipient)
    if (!isE164(recipient)) {
        return 'Number must be in E164 format!'
    }

    const message = {
        body: body,
        to: recipient,
        from: twilioNumber
    }

    return client.messages.create(message)
}

exports.sendMessages = functions
    .runWith({ secrets: ["TWILIO_SID", "TWILIO_AUTH", "TWILIO_PHONE"] })
    .pubsub.schedule('58 23 * * *')
    .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
    .onRun(async (context) => {

    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH)
    const twilioNumber = process.env.TWILIO_PHONE

    
    const snap = await db.doc('index/messages').get();
    const orgs = snap.data();

    Object.keys(orgs).forEach(async(current) => {
        const people = (await db.doc(current + '/chat').get()).data();

        Object.keys(people).forEach(async (person) => {
            const avsDoc = db.doc(current + '/agenda/availability/' + person);
            functions.logger.log('avsdoc', avsDoc)
            const avs = (await avsDoc.get()).data();
            functions.logger.log('avs', avs)

            const recipient = '+1' + (await db.doc('users/' + person).get()).data().info.phonenumber;
            functions.logger.log('recipient', recipient)
            const body = 'TEST MESSAGE'

            if (avs) {
                if (!avs[orgs[current]]) {
                    functions.logger.log('result', await sendTwilioMessage(client, twilioNumber, recipient, body))
                    
                }
            } else {
                functions.logger.log('result', await sendTwilioMessage(client, twilioNumber, recipient, body))
            }
        })

    })
    
    return null;
});