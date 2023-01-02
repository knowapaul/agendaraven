// React Resources
import { useNavigate } from "react-router-dom";

// MUI Resources
import { ThemeProvider } from "@emotion/react";

// Project Resources
import { mTheme } from "../resources/Themes";
import Loading from "../components/Loading";

// Firebase Resources
import { signOut } from "firebase/auth";
import { getFirebase } from "../resources/Firebase";


export default function Logout() {
    const navigate = useNavigate();
    
    signOut(getFirebase().auth).then(() => {
        navigate('/')
    }).catch((error) => {
        console.error(error)
    })

    return (
        <ThemeProvider theme={mTheme}>
            <Loading />
        </ThemeProvider>
    )
}