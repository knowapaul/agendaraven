import { collection, doc, setDoc } from "firebase/firestore"; 



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

export function createOrganization(db, orgName, user) {
    const orgUsers = collection(db, orgName + 'users')
    const orgData = collection(db, orgName + 'data')

    // Add the creator as a user
    setDoc(
        doc(orgUsers, )
    )

}

export function joinOrganization(db) {

}