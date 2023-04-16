// React Resources
import { useNavigate } from "react-router-dom";

// MUI Resources
import { ThemeProvider } from "@emotion/react";

// Project Resources
import { mTheme } from "../common/resources/Themes";
import Loading from "../common/load/Loading";

// Firebase Resources
import { signOut } from "firebase/auth";
import { getFirebase } from "../common/resources/Firebase";

export default function Logout() {
  const navigate = useNavigate();

  signOut(getFirebase().auth)
    .then(() => {
      navigate("/");
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <ThemeProvider theme={mTheme}>
      <Loading />
    </ThemeProvider>
  );
}
