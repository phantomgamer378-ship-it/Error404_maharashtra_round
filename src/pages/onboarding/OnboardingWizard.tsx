import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

export const OnboardingWizard = () => {
  const { user, initialize } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Profile
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  // Step 2: Creator DNA
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleComplete = async () => {
    if (!user) return;
    setIsLoading(true);
    setError('');

    try {
      // 1. Save Profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: user.id,
        display_name: displayName,
        bio,
      });

      if (profileError) throw profileError;

      // 2. Save DNA
      const { error: dnaError } = await supabase.from('creator_dna').upsert({
        user_id: user.id,
        niche: [niche],
        audience,
        tone,
        topics: [],
        platforms: [],
        goals: []
      });

      if (dnaError) throw dnaError;

      // Force store refresh
      await initialize();
      
      // Navigate to app
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save onboarding data.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl p-8 glass-panel-l2 rounded-2xl border border-border/50">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-4">
            <span className={step === 1 ? 'text-primary' : ''}>1. Profile</span>
            <span className={step === 2 ? 'text-primary' : ''}>2. Creator DNA</span>
            <span className={step === 3 ? 'text-primary' : ''}>3. Complete</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-destructive/20 text-destructive-foreground text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold">Complete your profile</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border h-24"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold">Define your Creator DNA</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Primary Niche (e.g. Tech, Finance, Comedy)</label>
              <input 
                type="text" 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <input 
                type="text" 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content Tone</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border"
              >
                <option value="">Select a tone</option>
                <option value="educational">Educational & Professional</option>
                <option value="entertaining">Entertaining & Casual</option>
                <option value="inspirational">Inspirational & Motivational</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 text-center">
            <h2 className="text-2xl font-bold">You're all set!</h2>
            <p className="text-muted-foreground">Your Creator DNA has been synthesized. We're ready to start building your content engine.</p>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button 
              onClick={handleBack}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg border border-border hover:bg-secondary"
            >
              Back
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleComplete}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              {isLoading ? 'Saving...' : 'Enter Dashboard'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
