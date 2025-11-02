import React from 'react';
import { Link } from 'react-router-dom';
import './welcome.css';


function Welcome() {
   return (

      <div className="dashboard-container">
         <div className="welcome-section">
            <h1>Dobrodošli u Molitveni Dnevnik</h1>
            <p>Vaše digitalno mesto za molitvu i refleksiju.</p>
         </div>

         <div className="dashboard-content">
            <div className="card">
               <h3>🔐 Prijavite se</h3>
               <p>Već imate račun? Prijavite se ovde.</p>
               <Link to="/login" className="btn">Prijavi se</Link>
            </div>

            <div className="card">
               <h3>📝 Registrujte se</h3>
               <p>Novi ste? Kreirajte svoj račun.</p>
               <Link to="/register" className="btn">Registruj se</Link>
            </div>

            <div className="card">
               <h3>📖 O nama</h3>
               <p>Saznajte više o našoj misiji.</p>
               <button className="btn">Više informacija</button>
            </div>
         </div>
      </div>);
}

export default Welcome;