// React Resources

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Paper, Typography } from "@mui/material";

// Project Resources
import Nav from "../items/Nav";
import { mTheme } from "../resources/Themes";

export default function Error(props) {
  return (
    <div>
      <Nav />
      <ThemeProvider theme={mTheme}>
        <CssBaseline />
        <Paper sx={{ padding: 3, margin: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Sorry, an error has occured
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Try refreshing the page and attempting your last action again.
          </Typography>
          <Typography>
            Since this website is very new, it is likely that you will see this
            message often. It is the best I can do so far. Your patience is
            greatly appreciated.
          </Typography>
        </Paper>
      </ThemeProvider>
    </div>
  );
}

export function FriendlyError(props) {
  return (
    <ThemeProvider theme={mTheme}>
      <CssBaseline />
      <Nav />
      <Paper sx={{ margin: 2, padding: 2 }}>
        <Typography variant="h5">{props.title}</Typography>
        <Typography>{props.text}</Typography>
      </Paper>
    </ThemeProvider>
  );
}
