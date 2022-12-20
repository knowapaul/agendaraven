//! This file is deprecated. For future context uses, use Firebase.js


import { createContext }  from 'react';

import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

export const DbContext = createContext(null);


export function Db(props) {
    const db = getFirestore(props.app);
    connectFirestoreEmulator(db, 'localhost', 8080);


    return (
        <DbContext.Provider value={db}>
            {props.children}
        </DbContext.Provider>
    )
}
