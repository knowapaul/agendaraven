// React Resources
import { createContext }  from 'react';

// Project Resources
import { initDatabase } from './HandleDb';

// Firebase Resources
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";


/**
 * Bundles all Firebase resources into a single context provider
 */
export const FbContext = createContext({});

/**
 * Bundles all Firebase resources into a single context provider
 * 
 * @param  {Map} props
 *  
 * props.app -> the Firebase app instance
 */
export function Firebase(props) {
    const auth = getAuth(props.app);
    connectAuthEmulator(auth, "http://localhost:9099")
    const db = getFirestore(props.app)
    connectFirestoreEmulator(db, 'localhost', 8080);
    const functions = getFunctions(props.app)
    connectFunctionsEmulator(functions, 'localhost', 5001);
    const storage = getStorage(props.app)
    connectStorageEmulator(storage, 'localhost', 9199);

    // Clean the database if it has not already been initialized
    // ! Do not use this in production! 
    setTimeout(() => {
        initDatabase(db)
    }, 5000)

    const firebase = {
        auth: auth, 
        db: db,
        functions: functions,
        storage: storage,
    }
    
    return (
        <FbContext.Provider value={firebase}>
            {props.children}
        </FbContext.Provider>
    )
}
