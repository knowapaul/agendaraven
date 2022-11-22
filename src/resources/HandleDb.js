import { collection, doc, setDoc } from "firebase/firestore"; 



export function addUserAccount(db, data, user) {
    const users = collection(db, 'users')

    const cData = Object.assign({schedulename: data.firstname}, data)

    return setDoc(
        doc(users, user.uid),
        {
            info: cData
        }
    )
}