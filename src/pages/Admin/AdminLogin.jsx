import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { toast } from 'sonner';
import './Admin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Please enter the password.');
      return;
    }

    const { success, error: authError } = login(password);
    
    if (success) {
      navigate('/admin/dashboard');
    } else {
      toast.error(authError || 'Login failed');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Dashboard</h2>
        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="admin-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
