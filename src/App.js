// Import pages for router
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import Logout from './pages/Logout.js';
import Inbox from './windows/Inbox.js';
import Schedules from './windows/Schedules.js';
import Availability from './windows/Availability.js';
import Insights from './windows/Insights.js';
import Payments from './windows/Payments.js';
import Account from './windows/Account.js';

import Loading from './components/Loading.js';

import { Auth } from './Auth'
import { Db } from './Db'
import { Storage } from './Storage.js';

import { 
  BrowserRouter as Router, 
  Routes,
  Route, 
  useLoaderData,
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import CreateAccount from './pages/CreateAccount.js'
import Organizations from './windows/Organizations.js';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBL_6B31bsdunqc6cmtcK_5TQe4yCrwgzQ",
  authDomain: "agendaraven.firebaseapp.com",
  databaseURL: "https://agendaraven-default-rtdb.firebaseio.com",
  projectId: "agendaraven",
  storageBucket: "agendaraven.appspot.com",
  messagingSenderId: "340176336844",
  appId: "1:340176336844:web:8ddfbdbd363e3006058f69",
  measurementId: "G-X70DWSTK4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


const router = createBrowserRouter([
  { path: "/", element: <Home />},
  { path: "dashboard", element: <Dashboard><Organizations /></Dashboard>},
  { path: "/dashboard/organizations", element: <Dashboard><Organizations /></Dashboard>},
  { path: "/dashboard/inbox", element: <Dashboard><Inbox /></Dashboard>},
  { path: "/dashboard/schedules", element: <Dashboard><Schedules /></Dashboard>},
  { path: "/dashboard/availability", element: <Dashboard><Availability /></Dashboard>},
  { path: "/dashboard/insights", element: <Dashboard><Insights /></Dashboard>},
  { path: "/dashboard/payments", element: <Dashboard><Payments /></Dashboard>},
  { path: "/dashboard/account", element: <Dashboard><Account /></Dashboard>},
  { path: "logout", element: <Logout />},
  { path: "createaccount", element: <CreateAccount /> },
  { path: "page/:organization", element: <OrgHome />},
  { path: "/:contactId", element: <Contact />, loader: loader},
  { path: "loading", element: <Loading />}
]);


async function loader({ params }) {
  console.log(params.contactId)
  return params.contactId;
}

function Contact() {
  const contact = useLoaderData();
  return (
    <p>{contact}</p>
  )
}

function OrgHome(props) {
  console.log(props)
  const org = useLoaderData();
  return (
    <p>{org}</p>
  )
}


/* <Router>
            <Routes>
              { path: "/", element: <Home />} />
              { path: "dashboard", element: <Dashboard><Organizations /></Dashboard>} />
              { path: "/dashboard/organizations", element: <Dashboard><Organizations /></Dashboard>} />
              { path: "/dashboard/inbox", element: <Dashboard><Inbox /></Dashboard>} />
              { path: "/dashboard/schedules", element: <Dashboard><Schedules /></Dashboard>} />
              { path: "/dashboard/availability", element: <Dashboard><Availability /></Dashboard>} />
              { path: "/dashboard/insights", element: <Dashboard><Insights /></Dashboard>} />
              { path: "/dashboard/payments", element: <Dashboard><Payments /></Dashboard>} />
              { path: "/dashboard/account", element: <Dashboard><Account /></Dashboard>} />
              { path: "logout", element: <Logout />} />
              { path: "createaccount", element: <CreateAccount /> } />
              { path: "page/:organization", element: <OrgHome />} loader={load}/>
            </Routes>
          </Router> */

function App() {
  return (
    <Auth app={app}>
      <Db app={app}>
        <Storage app={app}>
          <RouterProvider router={router} />
        </Storage>
      </Db>
    </Auth>
  );
}

export default App;
