// React Resources
import { useLoaderData, useNavigate } from "react-router-dom";

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import {
  CalendarToday,
  Dashboard,
  Groups,
  Home,
  Logout,
  Settings,
} from "@mui/icons-material";
import { CssBaseline } from "@mui/material";

// Project Resources
import { useEffect } from "react";
import AuthCheck from "../account/AuthCheck";
import DashModel from "../common/layouts/DashModel";
import FriendlyLoad from "../common/load/FriendlyLoad";
import OrgCheck from "../account/OrgCheck";
import Archives from "./archives";
import OrgHome from "./home";
import OrgSettings from "./settings";
import People from "./people";
import Schedules from "./schedules";
import { getFirebase } from "../common/resources/Firebase";
import { uTheme } from "../common/resources/Themes";

//    ["Availability", <EventAvailable color={'secondary'} />],

// ["Chat", <Message color={'secondary'} />],
// ["2" , ""],
// ["Insights", <Insights color={'secondary'} />],

const menu = [
  ["Home", <Home color="secondary" />],
  ["Schedules", <CalendarToday color={"secondary"} />],
  ["People", <Groups color={"secondary"} />],
  ["Settings", <Settings color={"secondary"} />],
  ["3", ""],
  ["My Dashboard", <Dashboard color={"secondary"} />],
  ["Log Out", <Logout color={"secondary"} />],
];

export async function orgLoader({ params }) {
  return [params.org, params.page];
}

function DashNavigate() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return <div></div>;
}

export function OrgDash(props) {
  const [org, page] = useLoaderData();

  // chat: <Chat org={org} />,
  // insights: <OrgInsights />
  const elementMap = {
    people: <People org={org} />,
    schedules: <Schedules org={org} />,
    home: <OrgHome org={org} />,
    settings: <OrgSettings org={org} />,
    dashboard: <DashNavigate />,
    archives: <Archives org={org} />,
  };

  // <CircleOutlined sx={{fontSize: '48px'}} color={'secondary'} />
  const icon = {
    icon: (
      <FriendlyLoad
        source={`${org}/index/icon`}
        style={{ borderRadius: "24px" }}
        storage={getFirebase().storage}
        height={"48px"}
        width={"48px"}
        alt={
          <img
            alt=""
            src="/logoicon.ico"
            style={{ height: "48px", width: "48px" }}
          />
        }
      />
    ),
    href: `/${org}/home`,
    title: org[0].toUpperCase() + org.slice(1),
  };

  return (
    <AuthCheck>
      <OrgCheck org={org}>
        {(loading) => (
          <ThemeProvider theme={uTheme}>
            <CssBaseline />
            <DashModel
              menuItems={menu}
              page={page}
              title={page}
              logo={icon}
              path={`/${org}/`}
            >
              {elementMap[page]}
            </DashModel>
          </ThemeProvider>
        )}
      </OrgCheck>
    </AuthCheck>
  );
}
