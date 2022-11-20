import { createContext }  from 'react';

import { getFirestore } from "firebase/firestore";

export const DbContext = createContext(null);


export function Db(props) {
    const db = getFirestore(props.app);

    return (
        <DbContext.Provider value={db}>
            {props.children}
        </DbContext.Provider>
    )
}
