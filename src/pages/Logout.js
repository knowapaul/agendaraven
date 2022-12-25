// React Resources
import { useNavigate } from "react-router-dom";

// MUI Resources
import { ThemeProvider } from "@emotion/react";

// Project Resources
import { FbContext } from "../resources/Firebase";
import { mTheme } from "../resources/Themes";
import Loading from "../components/Loading";

// Firebase Resources
import { signOut } from "firebase/auth";


export default function Logout() {
    const navigate = useNavigate();
    
    return (
        <ThemeProvider theme={mTheme}>
            <FbContext.Consumer>
                {firebase => {
                    const auth = firebase.auth;
                    signOut(auth).then(() => {
                        navigate('/')
                    }).catch((error) => {
                        console.error(error)
                    })
                    return (
                        <Loading />
                    )
                }}
            </FbContext.Consumer>
        </ThemeProvider>
    )
}