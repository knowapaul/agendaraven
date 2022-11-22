import { createContext }  from 'react';

import { getStorage, connectStorageEmulator } from "firebase/storage";

export const StorageContext = createContext(null);


export function Storage(props) {
    const storage = getStorage(props.app);
    connectStorageEmulator(storage, 'localhost', 9199);

    return (
        <StorageContext.Provider value={storage}>
            {props.children}
        </StorageContext.Provider>
    )
}
