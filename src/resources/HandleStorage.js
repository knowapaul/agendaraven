// Firebase Resources
import { ref, getDownloadURL, uploadBytes, listAll } from "firebase/storage"; 


export function accessImage(storage, location, setURL) {
    getDownloadURL(ref(storage, location))
        .then((url) => {
            setURL(url)
        })
        .catch((error) => {
            setURL('ERROR')
        });
}

export async function uploadFile(storage, file, root, unique) {
    const loc =  (root ? root : '') + (unique ? '' : file.name);

    const storageRef = ref(storage, loc);

    // 'file' comes from the Blob or File API
    return uploadBytes(storageRef, file)
}

export async function getOrgFiles(storage, path, setFiles) {
    const listRef = ref(storage, path);

    // Find all the prefixes and items.
    const res = await listAll(listRef);
    setFiles(res.items)
}