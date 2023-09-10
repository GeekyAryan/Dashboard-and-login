import logo from './logo.svg';
import './App.css';
import Patient from './screens/Patient';
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import DisplayAllPatients from './screens/DisplayAllPatients';
import DashBoard from './screens/DashBoard';
import AdminLogin from './screens/AdminLogin';

function App() {
  return (
    <div className="App">
     <Router>
        <Routes>
        <Route element={<Patient/>} path="/" />
        <Route element={<DisplayAllPatients/>} path="/displayallpatients" />

      <Route element={<DashBoard/>} path="/dashboard/*" />
      <Route element={<AdminLogin/>} path="/adminlogin" />
        </Routes>
        </Router>
    </div>
  );
}

export default App;
