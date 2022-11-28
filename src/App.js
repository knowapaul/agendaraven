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
import { OrgDash, orgLoader } from './pages/OrgDash'
import { createContext } from 'react';

import Loading from './components/Loading.js';

import Error from './components/Error'

import { Auth } from './resources/Auth'
import { Db } from './resources/Db'
import { Storage } from './resources/Storage.js';
import { Firebase } from './resources/Firebase.js';

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
  { errorElement: <Error />, path: "/", element: <Home />},
  { errorElement: <Error />, path: "dashboard", element: <Dashboard><Organizations /></Dashboard>},
  { errorElement: <Error />, path: "/dashboard/organizations", element: <Dashboard><Organizations /></Dashboard>},
  { errorElement: <Error />, path: "/dashboard/inbox", element: <Dashboard><Inbox /></Dashboard>},
  { errorElement: <Error />, path: "/dashboard/schedules", element: <Dashboard><Schedules /></Dashboard>},
  { errorElement: <Error />, path: "/dashboard/availability", element: <Dashboard><Availability /></Dashboard>},
  { errorElement: <Error />, path: "/dashboard/insights", element: <Dashboard><Insights /></Dashboard>},
  { errorElement: <Error />, path: "/dashboard/payments", element: <Dashboard><Payments /></Dashboard>},
  { errorElement: <Error />, path: "/dashboard/account", element: <Dashboard><Account /></Dashboard>},
  { errorElement: <Error />, path: "logout", element: <Logout />},
  { errorElement: <Error />, path: "createaccount", element: <CreateAccount /> },
  { errorElement: <Error />, path: "/:org", element: <OrgDash />, loader: orgLoader},
  { errorElement: <Error />, path: "loading", element: <Loading />}
]);





/* <Router>
            <Routes>
              { errorElement: <Error />, path: "/", element: <Home />} />
              { errorElement: <Error />, path: "dashboard", element: <Dashboard><Organizations /></Dashboard>} />
              { errorElement: <Error />, path: "/dashboard/organizations", element: <Dashboard><Organizations /></Dashboard>} />
              { errorElement: <Error />, path: "/dashboard/inbox", element: <Dashboard><Inbox /></Dashboard>} />
              { errorElement: <Error />, path: "/dashboard/schedules", element: <Dashboard><Schedules /></Dashboard>} />
              { errorElement: <Error />, path: "/dashboard/availability", element: <Dashboard><Availability /></Dashboard>} />
              { errorElement: <Error />, path: "/dashboard/insights", element: <Dashboard><Insights /></Dashboard>} />
              { errorElement: <Error />, path: "/dashboard/payments", element: <Dashboard><Payments /></Dashboard>} />
              { errorElement: <Error />, path: "/dashboard/account", element: <Dashboard><Account /></Dashboard>} />
              { errorElement: <Error />, path: "logout", element: <Logout />} />
              { errorElement: <Error />, path: "createaccount", element: <CreateAccount /> } />
              { errorElement: <Error />, path: "page/:organization", element: <OrgHome />} loader={load}/>
            </Routes>
          </Router> */


// export const AppContext = createContext(null);
          
// function App() {
//   return (
//     <Auth app={app}>
//       <Db app={app}>
//         <Storage app={app}>
//           <AppContext.Provider value={app}>
//             <RouterProvider router={router} />
//           </AppContext.Provider>
//         </Storage>
//       </Db>
//     </Auth>
//   );
// }

          
function App() {
  return (
    <Firebase app={app}>
        <RouterProvider router={router} />
    </Firebase>
  );
}

export default App;
