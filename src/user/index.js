// React Resources
import * as React from "react";

// MUI Resources
import { ThemeProvider } from "@emotion/react";
import { DashboardCustomize, Logout } from "@mui/icons-material";
import CssBaseline from "@mui/material/CssBaseline";

// Project Resources
import { useLoaderData } from "react-router-dom";
import AuthCheck from "../account/AuthCheck";
import DashModel from "../common/layouts/DashModel";
import { uTheme } from "../common/resources/Themes";
import Organizations from "./Organizations";

// ["Inbox", <Mail color="secondary" />],
// ["Posted Schedules", <CalendarToday color="secondary" />],
// ["My Availability", <EventAvailable color="secondary" />],
// ["", ""],
// ["Insights", <InsightsIcon color="secondary" />],
// ["", ""],
// ["Payments", <PaymentsIcon color="secondary" />],

// ["Account", <AccountCircle color="secondary" />],

//     ["Account", <AccountCircle color="secondary" />],

const menu = [
  ["My Organizations", <DashboardCustomize color="secondary" />],
  ["1", ""],
  ["Log Out", <Logout color="secondary" />],
];

export async function dashLoader({ params }) {
  const page = params.page ? params.page : "organizations";
  return page;
}

export function Dashboard(props) {
  const page = useLoaderData();

  const elementMap = {
    organizations: <Organizations />,
  };

  return (
    <AuthCheck>
      <ThemeProvider theme={uTheme}>
        <CssBaseline />
        <DashModel
          menuItems={menu}
          logo={{
            title: "AgendaRaven",
            href: "/",
            icon: <img src="/favicon.ico" width="48" height="48" alt="logo" />,
          }}
          page={page}
          path={`/dashboard/`}
        >
          {elementMap[page]}
        </DashModel>
      </ThemeProvider>
    </AuthCheck>
  );
}
