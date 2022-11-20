import { Paper } from "@mui/material"
import AuthCheck from "../components/AuthCheck"
import Nav from '../components/Nav'


export default function Dashboard() {
    return (
        <div>
            <Nav />
            <AuthCheck>
                <Paper>Welcome to the dashboard!</Paper>
            </AuthCheck>
        </div>
        
    )
}