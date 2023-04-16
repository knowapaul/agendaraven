// React Resources
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Project Resources
import Home from "./home";
import { Dashboard, dashLoader } from "./user";
import Logout from "./account/Logout.js";
import { OrgDash, orgLoader } from "./organization";
import Loading from "./common/load/Loading.js";
import Error from "./common/errors/Error";
import CreateAccount from "./account/CreateAccount.js";
import Page404 from "./common/errors/404";

// Firebase Resources
import { initializeApp } from "firebase/app";
import Soar, { schLoader } from "./soar";
// import ViewSubpages from './org-subpages/ViewSubpages.js';
import { setApp } from "./common/resources/Firebase.js";
import Help from "./help";
import { ScheduleView } from "./schedule";
import ForgotPassword from "./account/ForgotPassword.js";

// import { getAnalytics } from "firebase/analytics";

// TODO: Analyze bundle size and possibly convert imports to more efficient formats

const firebaseConfig = {
  apiKey: "AIzaSyBL_6B31bsdunqc6cmtcK_5TQe4yCrwgzQ",
  authDomain: "agendaraven.firebaseapp.com",
  databaseURL: "https://agendaraven-default-rtdb.firebaseio.com",
  projectId: "agendaraven",
  storageBucket: "agendaraven.appspot.com",
  messagingSenderId: "340176336844",
  appId: "1:340176336844:web:8ddfbdbd363e3006058f69",
  measurementId: "G-X70DWSTK4X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

setApp(app);

// const analytics = getAnalytics(app);

const router = createBrowserRouter([
  { errorElement: <Error />, path: "/", element: <Home /> },

  {
    errorElement: <Error />,
    path: "/dashboard/:page",
    element: <Dashboard />,
    loader: dashLoader,
  },
  {
    errorElement: <Error />,
    path: "/dashboard",
    element: <Dashboard />,
    loader: dashLoader,
  },

  {
    errorElement: <Error />,
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },

  {
    errorElement: <Error />,
    path: "/:org/:page",
    element: <OrgDash page="home" />,
    loader: orgLoader,
  },

  {
    errorElement: <Error />,
    path: "/:org/schedules/:sch",
    element: <ScheduleView />,
    loader: schLoader,
  },

  { errorElement: <Error />, path: "logout", element: <Logout /> },
  {
    errorElement: <Error />,
    path: "createaccount",
    element: <CreateAccount />,
  },

  { errorElement: <Error />, path: "loading", element: <Loading /> },

  {
    errorElement: <Error />,
    path: "/soar/:org/:sch/:tab",
    element: <Soar />,
    loader: schLoader,
  },

  { errorElement: <Error />, path: "/help", element: <Help /> },

  { path: "*", element: <Page404 /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
