import { ref, getDownloadURL } from "firebase/storage"; 


export function accessImage(storage, location, setURL) {
    getDownloadURL(ref(storage, location))
        .then((url) => {
            setURL(url)
        })
        .catch((error) => {
            console.log(error.message)
        });
}