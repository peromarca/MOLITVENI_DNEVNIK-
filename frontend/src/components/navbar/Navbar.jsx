import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './navbar.css';


function Navbar() {


   const { user, setUser } = useContext(UserContext);
   const navigate = useNavigate();
   const [error, setError] = useState('');


   const logoutonSubmit = async (e) => {
      console.log('Logout clicked');
      e.preventDefault();

      try {
         const response = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
         });
         const data = await response.json();

         if (data.success) {
            setUser(null);        // ← Obriši user iz Context-a!
            navigate('/login');
         }
         else {
            setError(data.error || 'Greška pri odjavi');
         }

      } catch (err) {
         setError('Greška pri povezivanju sa serverom');
      }
   };


   return (
      <nav className="navbar">
         <div className="navbar-content">
            <div className="navbar-left">
               <Link to="/" className="navbar-home">
                  <span className="home-icon">⛪︎</span>
               </Link>
            </div>

            <div className="navbar-center">
               <h1 className="navbar-title">Molitveni Dnevnik</h1>
            </div>

            <div className="navbar-right">
               {user ? (
                  <>
                     <span className="user-info">👤 {user.ime}</span>
                     <button className="logout-btn" onClick={logoutonSubmit}>
                        Odjava
                     </button>
                  </>
               ) : (
                  <>
                     <Link to="/login" className="login-link">Prijava</Link>
                     <Link to="/register" className="register-link">Registracija</Link>
                  </>
               )}
            </div>
         </div>
      </nav>
   );
}

export default Navbar;