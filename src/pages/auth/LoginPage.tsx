import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // The auth listener in store will catch this and route automatically, 
      // but we can also manually navigate if needed.
      const destination = location.state?.from?.pathname || '/app/dashboard';
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass-panel-l2 rounded-2xl border border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back to VIDORA</h1>
          <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-destructive/20 text-destructive-foreground border border-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full p-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
};
