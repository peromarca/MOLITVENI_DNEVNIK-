import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './login.css';


function Login() {
   const location = useLocation();
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [pass, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   // Provjeri da li je proslijećen success parametar iz Register komponente
   useEffect(() => {
      if (location.state?.success === 'registered') {
         setSuccess('registered');
      }
   }, [location]);

   const togglePassword = () => {
      setShowPassword(!showPassword);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         // API poziv će biti ovdje
         const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pass })
         });

         const data = await response.json();

         if (data.success) {
            // Preusmjeri na dashboard
            navigate('/dashboard', { state: { email: email, success: 'loggedin' } });
         } else {
            setError(data.error || 'Greška pri prijavi');
         }
      } catch (err) {
         setError('Greška pri povezivanju sa serverom');
      }
   };

   return (
      <div className="basket">
         <h1>Login</h1>

         {error && (
            <div className="error-display">
               {error}
            </div>
         )}

         {success === 'registered' && (
            <div className="success-message">
               Uspešno ste registrovani! Možete se prijaviti.
            </div>
         )}

         <form onSubmit={handleSubmit}>
            <input
               className="user"
               type="email"
               name="email"
               placeholder="Enter your email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />

            <div className="password-container">
               <input
                  className="user"
                  type={showPassword ? 'text' : 'password'}
                  name="pass"
                  placeholder="Enter your password"
                  value={pass}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
               <span className="password-toggle" onClick={togglePassword}>
                  {showPassword ? '👁️' : null}
               </span>
            </div>

            <div className="remember">
               <input type="checkbox" name="remember" value="1" id="rememberMe" />
               <label htmlFor="rememberMe">Remember me</label>
            </div>

            <button className="btn" type="submit">Login</button>
         </form>

         <div className="remember">
            Not a member? <Link className="question" to="/register">Sign up now</Link>
         </div>
         <div className="remember">
            <Link className="question" to="/forgot-password">Forgot password?</Link>
         </div>
      </div>
   );
}

export default Login;