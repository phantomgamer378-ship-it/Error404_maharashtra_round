import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Create initial profile record if backend isn't doing it automatically
      // In production, an auth hook/trigger on the DB handles this.
      navigate('/onboarding', { replace: true });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass-panel-l2 rounded-2xl border border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground">Start building your creator empire</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-destructive/20 text-destructive-foreground border border-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required 
            />
          </div>
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
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required 
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required 
              minLength={8}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full p-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
