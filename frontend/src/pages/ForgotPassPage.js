import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ForgotPassPage.css';

function ForgotPassPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao solicitar redefinição.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Redefinir Senha</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Endereço de Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {submitted && (
          <div className="success-message">
            Instruções de redefinição enviadas para seu email.
          </div>
        )}
        <button type="submit" className="login-button">Enviar</button>
      </form>
      <div className="login-links">
        <Link to="/login" className="link-button">Voltar ao login</Link>
        <Link to="/" className="link-button">Início</Link>
      </div>
      <button onClick={() => navigate(-1)} className="back-button">Voltar</button>
    </div>
  );
}

export default ForgotPassPage;
