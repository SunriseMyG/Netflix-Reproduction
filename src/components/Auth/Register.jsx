import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      if (response.data) {
        navigate('/login');
      } else {
        setError('Erreur lors de l\'inscription.');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Erreur lors de l\'inscription.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer plus tard.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Créer un compte</h2>
      {error && <p className="register-error">{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="register-field">
          <label className="register-label">Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="register-input"
          />
        </div>
        <div className="register-field">
          <label className="register-label">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
        </div>
        <div className="register-field">
          <label className="register-label">Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
        </div>
        <button type="submit" className="register-button">S'inscrire</button>
      </form>
      <div className="register-login-link">
        <button 
          onClick={() => navigate('/login')} 
          className="register-login-button"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
};

export default Register;
