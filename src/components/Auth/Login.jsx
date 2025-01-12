import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setError('Erreur de connexion, aucun token reçu.');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Identifiants incorrects');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer plus tard.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Se connecter</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-field">
          <label className="login-label">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="login-field">
          <label className="login-label">Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">Se connecter</button>
      </form>
      <div className="login-register-link">
        <button 
          onClick={() => navigate('/register')} 
          className="login-register-button"
        >
          Pas encore de compte ? S'inscrire
        </button>
      </div>
    </div>
  );
};

export default Login;
