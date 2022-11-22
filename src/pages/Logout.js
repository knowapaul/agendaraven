import { ThemeProvider } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import { Container } from "@mui/system";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth";
import { mTheme } from "../Themes";
import Loading from "../components/Loading";


export default function Logout() {
    const navigate = useNavigate();
    
    return (
        <ThemeProvider theme={mTheme}>
            <AuthContext.Consumer>
                {auth => {
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
            </AuthContext.Consumer>
        </ThemeProvider>
    )
}