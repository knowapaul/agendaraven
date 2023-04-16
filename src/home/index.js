// MUI Resources
import { CssBaseline, Box, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

// Project Resources
import Nav from "../common/items/Nav.js";
import { mTheme } from "../common/resources/Themes.js";

export default function Home() {
  return (
    <div>
      <ThemeProvider theme={mTheme}>
        <CssBaseline />
        <Nav />

        <Box padding={2}>
          <Typography variant={"h6"}>Welcome to AgendaRaven!</Typography>
          <Typography variant="h6">
            Click "dashboard" and create an account to get started.
          </Typography>
        </Box>
      </ThemeProvider>
    </div>
  );
}
