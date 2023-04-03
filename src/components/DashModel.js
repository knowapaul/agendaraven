// React Resources
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// MUI Resources
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import Typography from "@mui/material/Typography";

// Project Resources
import AuthCheck from "../components/AuthCheck";
import CustomAvatar from "../components/CustomAvatar";
import { uTheme } from "../resources/Themes";
import { ErrorBoundary } from "./ErrorBoundary";

const drawerWidth = 250;

function lowLast(text) {
  return text.split(" ").slice(-1)[0].toLowerCase();
}

function Logo(props) {
  return (
    <Link
      to={props.href}
      style={{ textDecoration: "none", color: uTheme.palette.primary.main }}
    >
      <Stack direction="row" spacing={0.5} margin={1}>
        {props.icon}
        <Typography
          variant="h6"
          className="quicksand"
          noWrap
          sx={{
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: uTheme.palette.text.secondary,
            textAlign: "center",
            pt: 1,
            margin: 0,
            pl: 0,
          }}
        >
          {props.title}
        </Typography>
      </Stack>
    </Link>
  );
}

function MenuItem(props) {
  const navigate = useNavigate();

  const handleClick = (text) => {
    if (text === "Log Out") {
      navigate("/logout");
    } else {
      // Just use the last word of the button's string
      navigate(props.path + lowLast(text));
    }
  };

  const isSelected = lowLast(props.page) === lowLast(props.text);

  return (
    <ListItem
      disablePadding
      onClick={() => {
        handleClick(props.text);
      }}
      sx={{
        backgroundColor: isSelected
          ? uTheme.palette.primary.main
          : uTheme.palette.background.default,
      }}
    >
      <ListItemButton>
        <ListItemIcon color="secondary">{props.icon}</ListItemIcon>
        <ListItemText
          primary={props.text}
          sx={{
            color: isSelected
              ? uTheme.palette.background.default
              : uTheme.palette.primary.main,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

function Menu(props) {
  return (
    <List>
      {props.items.map((item, n) => {
        const text = item[0];
        const Icon = item[1];
        return Icon ? (
          <MenuItem
            key={n}
            path={props.path}
            setSelected={props.setSelected}
            page={props.page}
            text={text}
            icon={Icon}
            menuColor={props.menuColor}
          />
        ) : (
          <Divider
            key={n}
            sx={{ borderColor: uTheme.palette.primary.main, margin: 1 }}
          />
        );
      })}
    </List>
  );
}

/**
 * A universal shell for dashboard formats
 *
 * @param    {Map} props
 * *React props:*
 * - *props.menuItems: map of menu items in the format *name : icon*
 * - *props.page: the path of the currently selected menu item
 * - *props.path: the root path of the page
 * - props.logo: {title, icon, href} the logo props
 * - props.customLogo: a logo to display instead of the default logo
 * - props.customHeader: a header to display instead of the default header
 */
export default function DashModel(props) {
  const { win } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [smallScreen, setSmallScreen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar disableGutters sx={{ boxShadow: "none" }}>
        {props.customLogo ? props.customLogo : <Logo {...props.logo} />}
      </Toolbar>
      <Divider sx={{ borderColor: uTheme.palette.primary.main }} />
      <Menu path={props.path} page={props.page} items={props.menuItems} />
    </div>
  );

  const container = win !== undefined ? () => win().document.body : undefined;

  useEffect(() => {
    window.onscroll = () => {
      if (window.scrollY === 0) {
        setAtTop(true);
      } else {
        if (atTop) {
          setAtTop(false);
        }
      }
    };

    function checkSize() {
      if (Math.min(window.innerHeight, window.innerWidth) < 600) {
        if (!smallScreen) {
          setSmallScreen(true);
        }
      } else if (smallScreen) {
        setSmallScreen(false);
      }
    }

    checkSize();

    window.onresize = checkSize;
  });

  return (
    <ThemeProvider theme={uTheme}>
      <AuthCheck>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            height: smallScreen ? "100%" : "100vh",
            width: "100vw",
            position: "static",
            top: 0,
            left: 0,
          }}
        >
          <Box
            component="nav"
            sx={{
              width: smallScreen ? undefined : drawerWidth,
              flexShrink: smallScreen ? undefined : 0,
            }}
            aria-label="mailbox folders"
          >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              onClick={handleDrawerToggle}
              sx={{
                display: smallScreen ? "initial" : "none",
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  backgroundColor: uTheme.palette.background.default,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Paper
              square
              sx={{
                backgroundColor: uTheme.palette.background.default,
                zIndex: 1201,
                position: "fixed",
                width: drawerWidth,
                display: smallScreen ? "none" : "initial",
                borderRight: `1px solid ${uTheme.palette.primary.main}`,
                height: "100vh",
              }}
            >
              {drawer}
            </Paper>
          </Box>
          <Box flex={1}>
            <Paper
              square
              elevation={atTop ? 0 : 10}
              sx={{
                position: "fixed",
                top: 0,
                right: 0,
                width: smallScreen ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
                backgroundColor: uTheme.palette.background.default
                  .replace(")", ", .6)")
                  .replace("rgb", "rgba"),
                flex: "0 1 auto",
                zIndex: 1200,
                ml: "1px",
                WebkitBackdropFilter: "blur(10px)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Toolbar disableGutters sx={{ height: "100%" }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    mr: 2,
                    display: smallScreen ? undefined : "none",
                    margin: 1,
                  }}
                >
                  <MenuIcon color="primary" />
                </IconButton>
                {props.customHeader ? (
                  <Box flexGrow={1}>{props.customHeader}</Box>
                ) : (
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      noWrap
                      component="div"
                      textAlign="center"
                      sx={{ color: uTheme.palette.text.secondary }}
                    >
                      {props.page[0].toUpperCase() + props.page.slice(1)}
                    </Typography>
                  </Box>
                )}
                <CustomAvatar />
              </Toolbar>
              <Divider
                sx={{
                  borderColor: uTheme.palette.primary.main,
                  display: smallScreen ? "none" : "block",
                }}
              />
            </Paper>
            <Box height={{ xs: "59px", sm: "65px" }} />
            <ErrorBoundary>
              <Box
                height={{ xs: "calc(100% - 59px)", sm: "calc(100% - 65px)" }}
                sx={{
                  flexGrow: 1,
                  width: "100%",
                }}
              >
                {props.children}
              </Box>
            </ErrorBoundary>
          </Box>
        </Box>
      </AuthCheck>
    </ThemeProvider>
  );
}
