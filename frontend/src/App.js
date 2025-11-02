import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar.jsx';
import Login from './components/login/Login.jsx';
import Register from './components/register/Register.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Welcome from './components/welcome/welcome.jsx';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <>
      <UserProvider>
        <Router>

          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </>
  );
}
export default App;