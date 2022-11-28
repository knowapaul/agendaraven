import { ThemeProvider } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import { Container } from "@mui/system";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FbContext } from "../resources/Firebase";
import { mTheme } from "../resources/Themes";
import Loading from "../components/Loading";


export default function Logout() {
    const navigate = useNavigate();
    
    return (
        <ThemeProvider theme={mTheme}>
            <FbContext.Consumer>
                {firebase => {
                    const auth = firebase.auth;
                    signOut(auth).then(() => {
                        console.log('success', auth)
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