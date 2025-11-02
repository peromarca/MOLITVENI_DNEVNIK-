import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';





function Register() {
   const navigate = useNavigate();
   const [user, setUser] = useState({
      ime: '',
      email: '',
      pass: '',
      pass2: ''
   });
   const [showPass, setShowPass] = useState(false);
   const [showPass2, setShowPass2] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');



   function togglePassword() {
      setShowPass(!showPass);

   }

   function togglePassword2() {
      setShowPass2(!showPass2);
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      const { ime, email, pass, pass2 } = user;
      // Provjeri da li se lozinke podudaraju
      if (pass !== pass2) {
         setError('Lozinke se ne podudaraju');
         return;
      }





      try {
         // API poziv na REGISTER endpoint
         const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ime, email, pass, pass2 })
         });

         const data = await response.json();

         if (data.success) {
            // Preusmjeri na login s success parametrom
            navigate('/login', { state: { success: 'registered' } });
         } else {
            setError(data.error || 'Greška pri registraciji');
         }
      } catch (err) {
         setError('Greška pri povezivanju sa serverom');
      }
   };



   return (
      <div className="basket">
         <h1>Register</h1>

         {error && (
            <div className="error-display">
               {error}
            </div>
         )}

         <form onSubmit={handleSubmit}>
            <input className="user"
               type="text"
               name="ime"
               placeholder="Enter your name"
               value={user.ime}
               onChange={(e) => setUser({ ...user, ime: e.target.value })} required />

            <input className="user"
               type="email"
               name="email"
               placeholder="Enter your email"
               value={user.email}
               onChange={(e) => setUser({ ...user, email: e.target.value })} required />


            <div className="password-container">
               <input className="user"
                  type={showPass ? "text" : "password"}
                  id="pass"
                  name="pass"
                  placeholder="Create a password"
                  value={user.pass}
                  onChange={(e) => setUser({ ...user, pass: e.target.value })} required />

               <span className="password-toggle" onClick={togglePassword}>{showPass ? '👁️' : null}</span>
            </div>

            <div className="password-container">
               <input className="user"
                  type={showPass2 ? "text" : "password"}
                  id="pass2"
                  name="pass2"
                  placeholder="Confirm a password"
                  value={user.pass2}
                  onChange={(e) => setUser({ ...user, pass2: e.target.value })} required />

               <span className="password-toggle" onClick={togglePassword2}>{showPass2 ? '👁️' : null}</span>
            </div>

            <div className="remember">
               <input type="checkbox" name="answer" value="0" id="termsCheckbox" required />
               <label htmlFor="termsCheckbox">I accept all terms and conditions</label>
            </div>

            <button className="btn" type="submit">Register</button>
         </form >

         <div className="remember">
            Already a member? <Link className="question" to="/login">Login now</Link>
         </div>
      </div >
   );


}

export default Register;