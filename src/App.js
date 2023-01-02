// React Resources
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Project Resources
import Home from './pages/Home.js';
import { Dashboard, dashLoader } from './pages/Dashboard.js';
import Logout from './pages/Logout.js';
import { OrgDash, orgLoader } from './pages/OrgDash'
import Loading from './components/Loading.js';
import Error from './components/Error'
import CreateAccount from './pages/CreateAccount.js'

// Firebase Resources
import { initializeApp } from "firebase/app";
import Soar, { schLoader, newLoader } from './soar/Soar.js';
import ViewSubpages from './org-subpages/ViewSubpages.js';
import { setApp } from './resources/Firebase.js';

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
  measurementId: "G-X70DWSTK4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

setApp(app)

// const analytics = getAnalytics(app);

const router = createBrowserRouter([
  { errorElement: <Error />, path: "/", element: <Home />},

  { errorElement: <Error />, path: "/dashboard/:page", element: <Dashboard />, loader: dashLoader},
  { errorElement: <Error />, path: "/dashboard", element: <Dashboard />, loader: dashLoader},

  { errorElement: <Error />, path: "/:org/:page", element: <OrgDash page="home" />, loader: orgLoader},

  { errorElement: <Error />, path: "/:org/schedules/:sch", element: <ViewSubpages />, loader: schLoader},

  { errorElement: <Error />, path: "logout", element: <Logout />},
  { errorElement: <Error />, path: "createaccount", element: <CreateAccount /> },
  
  { errorElement: <Error />, path: "loading", element: <Loading />},

  { errorElement: <Error />, path: "/soar/:org", element: <Soar />, loader: newLoader},
  { errorElement: <Error />, path: "/soar/:org/:sch", element: <Soar />, loader: schLoader}
]);
   
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
