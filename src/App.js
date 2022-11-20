// Import pages for router
import Home from './pages/Home.js'
import Dashboard from './pages/Dashboard.js'
import { 
  BrowserRouter as Router, 
  Routes,
  Route 
} from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
