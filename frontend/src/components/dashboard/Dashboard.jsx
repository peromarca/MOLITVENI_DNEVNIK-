import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './dashboard.css';
import { UserContext } from '../../context/UserContext';


function Dashboard() {
   const [email, setEmail] = useState('');
   const [success, setSuccess] = useState('');
   const location = useLocation();
   const navigate = useNavigate();
   const [error, setError] = useState('');
   const { user, setUser } = useContext(UserContext);


   useEffect(() => {
      if (location.state?.success === 'loggedin') {
         setEmail(location.state?.email || '');
         setSuccess('loggedin');
      }
   }, [location]);

   useEffect(() => {
      // Dohvati korisničke podatke s backend-a koristeći email
      const fetchUserData = async () => {
         try {
            const response = await fetch(`http://localhost:3001/users?email=${email}`);
            const data = await response.json();

            if (data.success) {
               setUser(data.user);

            } else {
               setError(data.error || 'Greška pri dohvaćanju korisničkih podataka');
            }
         } catch (err) {
            setError('Greška pri povezivanju sa serverom');
         }
      };

      fetchUserData();
   }, [email]);

   const logoutonSubmit = async (e) => {
      e.preventDefault();

      try {
         const response = await fetch('http://localhost:3001/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
         });
         const data = await response.json();

         if (data.success) {
            // Preusmjeri na login stranicu nakon odjave
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

      <div className="dashboard-container">
         {success === 'loggedin' && (
            <div className="success-message">
               Uspešno ste se prijavili!
            </div>
         )}


         <div className="welcome-section">
            <h1>Dobrodošli {user.ime !== null ? user.ime : 'Korisniče'}!</h1>
            <p>Vaš molitveni dnevnik vas čeka.</p>
         </div>

         <div className="dashboard-content">
            <div className="card">
               <h3>📖 Moji Zapisi</h3>
               <p>Pregledajte svoje molitvene zapise</p>
               <button className="btn">Otvori Dnevnik</button>
            </div>

            <div className="card">
               <h3>✍️ Novi Zapis</h3>
               <p>Dodajte novi molitveni zapis</p>
               <button className="btn">Kreiraj Zapis</button>
            </div>

            <div className="card">
               <h3>⚙️ Postavke</h3>
               <p>Uredite svoj profil i postavke</p>
               <button className="btn">Postavke</button>
            </div>

         </div>
      </div>



   );






}
export default Dashboard;